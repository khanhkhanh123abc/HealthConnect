import reviewService from '../services/reviewService';

const create = async (req, res) => {
    try {
        const info = await reviewService.createReview(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.error('[Review/create]', e.message);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
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
        console.error('[Review/getByDoctor]', e.message);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const getByBooking = async (req, res) => {
    try {
        const info = await reviewService.getReviewByBooking(req.query.bookingId);
        return res.status(200).json(info);
    } catch (e) {
        console.error('[Review/getByBooking]', e.message);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

const remove = async (req, res) => {
    try {
        const info = await reviewService.deleteReview(req.query.id, req.query.requesterId);
        return res.status(200).json(info);
    } catch (e) {
        console.error('[Review/remove]', e.message);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

module.exports = { create, getByDoctor, getByBooking, remove };
