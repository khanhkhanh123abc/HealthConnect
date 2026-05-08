import reviewService from '../services/reviewService';
import logger from '../utils/logger.js';

const create = async (req, res) => {
    try {
        const info = await reviewService.createReview(req.body);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[Review/create]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

const getByDoctor = async (req, res) => {
    try {
        const info = await reviewService.getReviewsByDoctor(req.query.doctorId, {
            page: req.query.page,
            limit: req.query.limit
        });
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[Review/getByDoctor]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

const getByBooking = async (req, res) => {
    try {
        const info = await reviewService.getReviewByBooking(req.query.bookingId);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[Review/getByBooking]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

const remove = async (req, res) => {
    try {
        const info = await reviewService.deleteReview(req.query.id, req.query.requesterId);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[Review/remove]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

module.exports = { create, getByDoctor, getByBooking, remove };
