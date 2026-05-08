import symptomKeywordService from '../services/symptomKeywordService';
import logger from '../utils/logger.js';

const getAll = async (req, res) => {
    try {
        const info = await symptomKeywordService.getAll(req.query.q);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[SymptomKeyword/getAll]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

const create = async (req, res) => {
    try {
        const info = await symptomKeywordService.create(req.body);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[SymptomKeyword/create]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

const update = async (req, res) => {
    try {
        const info = await symptomKeywordService.update(req.body);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[SymptomKeyword/update]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

const remove = async (req, res) => {
    try {
        const info = await symptomKeywordService.remove(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[SymptomKeyword/remove]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

module.exports = { getAll, create, update, remove };
