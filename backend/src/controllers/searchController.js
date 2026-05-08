import searchService from '../services/searchService';
import logger from '../utils/logger.js';

const globalSearch = async (req, res) => {
    try {
        const result = await searchService.quickSearch(req.query.q);
        return res.status(200).json(result);
    } catch (e) {
        logger.error('[Search/quick] error:', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error', doctors: [], specialties: [] });
    }
};

const fullSearch = async (req, res) => {
    try {
        const result = await searchService.search(req.query);
        return res.status(200).json(result);
    } catch (e) {
        logger.error('[Search/full] error:', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error', total: 0, page: 1, totalPages: 1, doctors: [], specialties: [] });
    }
};

module.exports = { globalSearch, fullSearch };
