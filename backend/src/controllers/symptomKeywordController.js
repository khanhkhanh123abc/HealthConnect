import symptomKeywordService from '../services/symptomKeywordService';

const getAll = async (req, res) => {
    try {
        const info = await symptomKeywordService.getAll(req.query.q);
        return res.status(200).json(info);
    } catch (e) {
        console.error('[SymptomKeyword/getAll]', e.message);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const create = async (req, res) => {
    try {
        const info = await symptomKeywordService.create(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.error('[SymptomKeyword/create]', e.message);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const update = async (req, res) => {
    try {
        const info = await symptomKeywordService.update(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.error('[SymptomKeyword/update]', e.message);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const remove = async (req, res) => {
    try {
        const info = await symptomKeywordService.remove(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        console.error('[SymptomKeyword/remove]', e.message);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

module.exports = { getAll, create, update, remove };
