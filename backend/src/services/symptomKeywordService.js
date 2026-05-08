import db from '../models/index';
import { Op, fn, col, where as sqlWhere } from 'sequelize';

const escapeLike = (str) => String(str || '').replace(/[\\%_]/g, m => `\\${m}`);

const getAll = async (q) => {
    const where = {};
    const trimmed = (q || '').trim();
    if (trimmed) {
        where[Op.and] = [
            sqlWhere(
                fn('LOWER', col('SymptomKeyword.keyword')),
                { [Op.like]: `%${escapeLike(trimmed.toLowerCase())}%` }
            )
        ];
    }

    // Plain rows + manual specialty merge avoids include-related serialization
    // issues ("result.get is not a function") from older Sequelize versions
    // when the joined association is null or aliased oddly.
    const rows = await db.SymptomKeyword.findAll({
        where,
        order: [['createdAt', 'DESC']],
        raw: true
    });

    if (!rows.length) return { errCode: 0, data: [] };

    const specialtyIds = [...new Set(rows.map(r => r.specialtyId).filter(Boolean))];
    const specialties = specialtyIds.length
        ? await db.Specialty.findAll({
            where: { id: { [Op.in]: specialtyIds } },
            attributes: ['id', 'name'],
            raw: true
        })
        : [];
    const specMap = Object.fromEntries(specialties.map(s => [s.id, s]));

    return {
        errCode: 0,
        data: rows.map(r => ({
            ...r,
            Specialty: specMap[r.specialtyId] || null
        }))
    };
};

const create = async (data) => {
    if (!data?.keyword || !data?.specialtyId) {
        return { errCode: 1, errMessage: 'Missing required parameters!' };
    }
    const specialty = await db.Specialty.findByPk(data.specialtyId);
    if (!specialty) return { errCode: 2, errMessage: 'Specialty not found' };

    const row = await db.SymptomKeyword.create({
        keyword: String(data.keyword).trim(),
        specialtyId: data.specialtyId
    });
    return { errCode: 0, errMessage: 'Created', data: row.toJSON() };
};

const update = async (data) => {
    if (!data?.id) return { errCode: 1, errMessage: 'Missing id' };
    const row = await db.SymptomKeyword.findByPk(data.id);
    if (!row) return { errCode: 2, errMessage: 'Keyword not found' };

    if (data.specialtyId) {
        const specialty = await db.Specialty.findByPk(data.specialtyId);
        if (!specialty) return { errCode: 3, errMessage: 'Specialty not found' };
        row.specialtyId = data.specialtyId;
    }
    if (data.keyword) row.keyword = String(data.keyword).trim();
    await row.save();
    return { errCode: 0, errMessage: 'Updated', data: row.toJSON() };
};

const remove = async (id) => {
    if (!id) return { errCode: 1, errMessage: 'Missing id' };
    const row = await db.SymptomKeyword.findByPk(id);
    if (!row) return { errCode: 2, errMessage: 'Keyword not found' };
    await row.destroy();
    return { errCode: 0, errMessage: 'Deleted' };
};

module.exports = { getAll, create, update, remove };
