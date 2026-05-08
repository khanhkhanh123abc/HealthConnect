import db from '../models/index';
import { Op, fn, col, where as sqlWhere } from 'sequelize';

const escapeLike = (str) => String(str || '').replace(/[\\%_]/g, m => `\\${m}`);

const getAll = async (q) => {
    const where = {};
    const trimmed = (q || '').trim();
    if (trimmed) {
        where[Op.and] = [
            sqlWhere(fn('LOWER', col('keyword')), { [Op.like]: `%${escapeLike(trimmed.toLowerCase())}%` })
        ];
    }
    const rows = await db.SymptomKeyword.findAll({
        where,
        include: [{ model: db.Specialty, attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']]
    });
    return { errCode: 0, data: rows };
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
    return { errCode: 0, errMessage: 'Created', data: row };
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
    return { errCode: 0, errMessage: 'Updated', data: row };
};

const remove = async (id) => {
    if (!id) return { errCode: 1, errMessage: 'Missing id' };
    const row = await db.SymptomKeyword.findByPk(id);
    if (!row) return { errCode: 2, errMessage: 'Keyword not found' };
    await row.destroy();
    return { errCode: 0, errMessage: 'Deleted' };
};

module.exports = { getAll, create, update, remove };
