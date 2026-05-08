import db from '../models/index';
import { Op, fn, col, where as sqlWhere } from 'sequelize';

const MAX_QUERY_LEN = 100;
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;
const MIN_KEYWORD_MATCH_LEN = 3;

// Escape SQL LIKE wildcards (% _ \) so user input cannot break out of LIKE pattern.
const escapeLike = (str) => String(str || '').replace(/[\\%_]/g, m => `\\${m}`);

const sanitizeQuery = (raw) => String(raw || '').trim().slice(0, MAX_QUERY_LEN);

// Find specialty IDs that have a SymptomKeyword whose value is contained in the
// (lowercased) user query. Requires the keyword to be at least 3 chars long
// to avoid noisy matches like "ho" matching "cough".
const findSpecialtyIdsBySymptom = async (queryLower) => {
    if (!queryLower) return [];
    const rows = await db.SymptomKeyword.findAll({
        attributes: ['specialtyId', 'keyword'],
        raw: true
    });
    const ids = new Set();
    for (const row of rows) {
        const kw = (row.keyword || '').trim().toLowerCase();
        if (kw.length < MIN_KEYWORD_MATCH_LEN) continue;
        if (queryLower.includes(kw)) ids.add(row.specialtyId);
    }
    return [...ids];
};

// Build a Sequelize WHERE for a doctor name LIKE match.
// Matches firstName, lastName, "lastName firstName", "firstName lastName"
// case-insensitively.
const buildDoctorNameWhere = (rawQuery) => {
    const q = sanitizeQuery(rawQuery).toLowerCase();
    const like = `%${escapeLike(q)}%`;
    return {
        [Op.or]: [
            sqlWhere(fn('LOWER', col('User.firstName')), { [Op.like]: like }),
            sqlWhere(fn('LOWER', col('User.lastName')),  { [Op.like]: like }),
            sqlWhere(fn('LOWER', fn('CONCAT', col('User.lastName'), ' ', col('User.firstName'))), { [Op.like]: like }),
            sqlWhere(fn('LOWER', fn('CONCAT', col('User.firstName'), ' ', col('User.lastName'))), { [Op.like]: like })
        ]
    };
};

// Build a Sequelize WHERE for specialty by name (case-insensitive English match).
const buildSpecialtyNameWhere = (rawQuery) => {
    const q = sanitizeQuery(rawQuery).toLowerCase();
    const like = `%${escapeLike(q)}%`;
    return sqlWhere(fn('LOWER', col('name')), { [Op.like]: like });
};

// Annotate plain doctor rows with specialty/clinic/price/rating.
// Avoids N+1 by batch-fetching markdown + ratings then merging in memory.
const enrichDoctors = async (doctorRows) => {
    if (!doctorRows.length) return [];
    const doctorIds = doctorRows.map(d => d.id);

    // markdown gives doctor → specialty + clinic mapping (project convention).
    const markdowns = await db.Markdown.findAll({
        where: { doctorId: { [Op.in]: doctorIds } },
        attributes: ['doctorId', 'specialtyId', 'clinicId'],
        raw: true
    });
    const markdownByDoctor = {};
    for (const m of markdowns) markdownByDoctor[m.doctorId] = m;

    const specialtyIds = [...new Set(markdowns.map(m => m.specialtyId).filter(Boolean))];
    const clinicIds   = [...new Set(markdowns.map(m => m.clinicId).filter(Boolean))];

    const [specialties, clinics, doctorInfos, ratings] = await Promise.all([
        specialtyIds.length
            ? db.Specialty.findAll({ where: { id: { [Op.in]: specialtyIds } }, attributes: ['id', 'name'], raw: true })
            : [],
        clinicIds.length
            ? db.Clinic.findAll({ where: { id: { [Op.in]: clinicIds } }, attributes: ['id', 'name'], raw: true })
            : [],
        db.Doctor_Info.findAll({
            where: { doctorId: { [Op.in]: doctorIds } },
            attributes: ['doctorId', 'priceId'],
            include: [{ model: db.allCode, as: 'priceData', attributes: ['value', 'keyMap'] }],
            raw: true,
            nest: true
        }),
        db.Review.findAll({
            where: { doctorId: { [Op.in]: doctorIds } },
            attributes: [
                'doctorId',
                [fn('AVG', col('rating')), 'averageRating'],
                [fn('COUNT', col('id')),  'reviewCount']
            ],
            group: ['doctorId'],
            raw: true
        })
    ]);

    const specById = Object.fromEntries(specialties.map(s => [s.id, s]));
    const clinicById = Object.fromEntries(clinics.map(c => [c.id, c]));
    const infoByDoctor = Object.fromEntries(doctorInfos.map(i => [i.doctorId, i]));
    const ratingByDoctor = Object.fromEntries(ratings.map(r => [r.doctorId, r]));

    return doctorRows.map(d => {
        const md = markdownByDoctor[d.id] || {};
        const spec = specById[md.specialtyId];
        const clinic = clinicById[md.clinicId];
        const info = infoByDoctor[d.id];
        const rating = ratingByDoctor[d.id];
        return {
            id: d.id,
            firstName: d.firstName || '',
            lastName: d.lastName || '',
            name: `${d.lastName || ''} ${d.firstName || ''}`.trim(),
            image: d.image || '',
            position: d.positionData?.value || '',
            gender: d.gender,
            specialtyId: md.specialtyId || null,
            specialtyName: spec?.name || '',
            clinicId: md.clinicId || null,
            clinicName: clinic?.name || '',
            priceId: info?.priceId || null,
            price: info?.priceData?.value || '',
            averageRating: rating ? Number(rating.averageRating) : 0,
            reviewCount: rating ? Number(rating.reviewCount) : 0
        };
    });
};

// Apply numeric / categorical filters in JS after we already enriched rows.
// Most filters are too cross-table to push into the SQL WHERE cleanly given
// the markdown + doctor_info layout, so we filter in memory after enrichment.
const applyDoctorFilters = (doctors, filters) => {
    let out = doctors;
    if (filters.specialtyId) {
        const ids = Array.isArray(filters.specialtyId) ? filters.specialtyId : [filters.specialtyId];
        const idSet = new Set(ids.map(Number));
        out = out.filter(d => d.specialtyId && idSet.has(d.specialtyId));
    }
    if (filters.clinicId) {
        const ids = Array.isArray(filters.clinicId) ? filters.clinicId : [filters.clinicId];
        const idSet = new Set(ids.map(Number));
        out = out.filter(d => d.clinicId && idSet.has(d.clinicId));
    }
    if (filters.gender) {
        out = out.filter(d => String(d.gender) === String(filters.gender));
    }
    if (filters.minRating != null) {
        const minR = Number(filters.minRating);
        if (!Number.isNaN(minR)) out = out.filter(d => d.averageRating >= minR);
    }
    if (filters.minPrice != null || filters.maxPrice != null) {
        const minP = filters.minPrice != null ? Number(filters.minPrice) : null;
        const maxP = filters.maxPrice != null ? Number(filters.maxPrice) : null;
        out = out.filter(d => {
            const p = parseFloat(d.price);
            if (Number.isNaN(p)) return minP == null && maxP == null;
            if (minP != null && p < minP) return false;
            if (maxP != null && p > maxP) return false;
            return true;
        });
    }
    return out;
};

const sortDoctorsDefault = (doctors) =>
    [...doctors].sort((a, b) => {
        if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
        return b.reviewCount - a.reviewCount;
    });

// Public: dropdown-style search returning up to 5 doctors and 5 specialties.
const quickSearch = async (rawQuery) => {
    const query = sanitizeQuery(rawQuery);
    if (!query || query.length < 2) {
        return { errCode: 0, doctors: [], specialties: [] };
    }
    const queryLower = query.toLowerCase();

    const [doctorRows, specByName, symptomSpecialtyIds] = await Promise.all([
        db.User.findAll({
            where: { [Op.and]: [{ roleId: 'R2' }, buildDoctorNameWhere(query)] },
            attributes: ['id', 'firstName', 'lastName', 'image', 'gender', 'positionId'],
            include: [{ model: db.allCode, as: 'positionData', attributes: ['value'] }],
            limit: 5,
            raw: true,
            nest: true
        }),
        db.Specialty.findAll({
            where: buildSpecialtyNameWhere(query),
            attributes: ['id', 'name', 'image'],
            limit: 5,
            raw: true
        }),
        findSpecialtyIdsBySymptom(queryLower)
    ]);

    let bySymptom = [];
    if (symptomSpecialtyIds.length) {
        bySymptom = await db.Specialty.findAll({
            where: { id: { [Op.in]: symptomSpecialtyIds } },
            attributes: ['id', 'name', 'image'],
            raw: true
        });
    }

    const specMap = new Map();
    for (const s of [...specByName, ...bySymptom]) specMap.set(s.id, s);
    const specialties = [...specMap.values()].slice(0, 5);

    const enrichedDoctors = await enrichDoctors(doctorRows);

    return {
        errCode: 0,
        doctors: enrichedDoctors.map(d => ({
            id: d.id,
            name: d.name,
            image: d.image,
            position: d.position,
            specialtyName: d.specialtyName
        })),
        specialties: specialties.map(s => ({ id: s.id, name: s.name, image: s.image }))
    };
};

// Public: full search-results query with filters, pagination, and result type.
const search = async (params) => {
    const rawQuery = sanitizeQuery(params.q);
    const type = ['all', 'doctors', 'specialties'].includes(params.type) ? params.type : 'all';
    const page = Math.max(1, parseInt(params.page, 10) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(params.limit, 10) || DEFAULT_LIMIT));
    const offset = (page - 1) * limit;

    const filters = {
        specialtyId: params.specialtyId,
        clinicId: params.clinicId,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        minRating: params.minRating,
        gender: params.gender
    };

    const queryLower = rawQuery.toLowerCase();
    const symptomSpecialtyIds = rawQuery
        ? await findSpecialtyIdsBySymptom(queryLower)
        : [];

    let doctors = [];
    let specialties = [];

    // ---- Doctors branch ------------------------------------------------
    if (type === 'all' || type === 'doctors') {
        const doctorWhere = { roleId: 'R2' };
        if (rawQuery) {
            doctorWhere[Op.and] = [buildDoctorNameWhere(rawQuery)];
        }
        const doctorRows = await db.User.findAll({
            where: doctorWhere,
            attributes: ['id', 'firstName', 'lastName', 'image', 'gender', 'positionId'],
            include: [{ model: db.allCode, as: 'positionData', attributes: ['value'] }],
            raw: true,
            nest: true
        });
        let enriched = await enrichDoctors(doctorRows);

        // Symptom mapping → expand candidate doctor pool to all doctors of the
        // matched specialties (only when there is a query).
        if (rawQuery && symptomSpecialtyIds.length) {
            const specMatchedDoctorRows = await db.Markdown.findAll({
                where: { specialtyId: { [Op.in]: symptomSpecialtyIds } },
                attributes: ['doctorId'],
                raw: true
            });
            const extraIds = [...new Set(specMatchedDoctorRows.map(m => m.doctorId))]
                .filter(id => !enriched.some(d => d.id === id));
            if (extraIds.length) {
                const extraRows = await db.User.findAll({
                    where: { id: { [Op.in]: extraIds }, roleId: 'R2' },
                    attributes: ['id', 'firstName', 'lastName', 'image', 'gender', 'positionId'],
                    include: [{ model: db.allCode, as: 'positionData', attributes: ['value'] }],
                    raw: true,
                    nest: true
                });
                const extraEnriched = await enrichDoctors(extraRows);
                enriched = [...enriched, ...extraEnriched];
            }
        }

        enriched = applyDoctorFilters(enriched, filters);
        enriched = sortDoctorsDefault(enriched);
        doctors = enriched;
    }

    // ---- Specialties branch -------------------------------------------
    if (type === 'all' || type === 'specialties') {
        const where = rawQuery
            ? {
                [Op.or]: [
                    buildSpecialtyNameWhere(rawQuery),
                    symptomSpecialtyIds.length ? { id: { [Op.in]: symptomSpecialtyIds } } : { id: -1 }
                ]
            }
            : {};
        if (filters.specialtyId) {
            const ids = (Array.isArray(filters.specialtyId) ? filters.specialtyId : [filters.specialtyId]).map(Number);
            where.id = { [Op.in]: ids };
        }
        specialties = await db.Specialty.findAll({
            where,
            attributes: ['id', 'name', 'image'],
            raw: true
        });
    }

    // ---- Pagination ---------------------------------------------------
    const total = type === 'doctors' ? doctors.length
        : type === 'specialties' ? specialties.length
        : doctors.length + specialties.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    let pagedDoctors = doctors;
    let pagedSpecialties = specialties;
    if (type === 'doctors') {
        pagedDoctors = doctors.slice(offset, offset + limit);
        pagedSpecialties = [];
    } else if (type === 'specialties') {
        pagedSpecialties = specialties.slice(offset, offset + limit);
        pagedDoctors = [];
    } else {
        // all: paginate the merged stream — specialties first, then doctors.
        const merged = [
            ...specialties.map(s => ({ kind: 'specialty', data: s })),
            ...doctors.map(d => ({ kind: 'doctor', data: d }))
        ];
        const slice = merged.slice(offset, offset + limit);
        pagedSpecialties = slice.filter(x => x.kind === 'specialty').map(x => x.data);
        pagedDoctors = slice.filter(x => x.kind === 'doctor').map(x => x.data);
    }

    return {
        errCode: 0,
        total,
        page,
        totalPages,
        limit,
        doctors: pagedDoctors,
        specialties: pagedSpecialties
    };
};

module.exports = { quickSearch, search };
