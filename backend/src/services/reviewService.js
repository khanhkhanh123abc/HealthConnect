import db from '../models/index';
import { Op, fn, col } from 'sequelize';

const COMPLETED_STATUS = 'S3';

const createReview = async (data) => {
    const { bookingId, patientId, rating, comment } = data || {};
    if (!bookingId || !patientId || !rating) {
        return { errCode: 1, errMessage: 'Missing required parameters!' };
    }
    const ratingInt = parseInt(rating, 10);
    if (Number.isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
        return { errCode: 2, errMessage: 'Rating must be between 1 and 5' };
    }

    const booking = await db.Bookings.findByPk(bookingId);
    if (!booking) return { errCode: 3, errMessage: 'Booking not found' };
    if (booking.patientId !== Number(patientId)) {
        return { errCode: 4, errMessage: 'Booking does not belong to this patient' };
    }
    if (booking.statusId !== COMPLETED_STATUS) {
        return { errCode: 5, errMessage: 'Only completed appointments can be reviewed' };
    }

    const existing = await db.Review.findOne({ where: { bookingId } });
    if (existing) return { errCode: 6, errMessage: 'This appointment has already been reviewed' };

    const review = await db.Review.create({
        doctorId: booking.doctorId,
        patientId: booking.patientId,
        bookingId,
        rating: ratingInt,
        comment: (comment || '').trim() || null
    });

    return { errCode: 0, errMessage: 'Review submitted', data: review };
};

const getReviewsByDoctor = async (doctorId, { page = 1, limit = 10 } = {}) => {
    if (!doctorId) return { errCode: 1, errMessage: 'Missing doctorId' };
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    const { rows, count } = await db.Review.findAndCountAll({
        where: { doctorId },
        include: [{
            model: db.User,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'image']
        }],
        order: [['createdAt', 'DESC']],
        limit: l,
        offset: (p - 1) * l
    });

    const aggregate = await db.Review.findOne({
        where: { doctorId },
        attributes: [
            [fn('AVG', col('rating')), 'averageRating'],
            [fn('COUNT', col('id')), 'reviewCount']
        ],
        raw: true
    });

    return {
        errCode: 0,
        total: count,
        page: p,
        totalPages: Math.max(1, Math.ceil(count / l)),
        averageRating: aggregate?.averageRating ? Number(aggregate.averageRating) : 0,
        reviewCount: aggregate?.reviewCount ? Number(aggregate.reviewCount) : 0,
        data: rows
    };
};

const getReviewByBooking = async (bookingId) => {
    if (!bookingId) return { errCode: 1, errMessage: 'Missing bookingId' };
    const review = await db.Review.findOne({ where: { bookingId } });
    return { errCode: 0, data: review };
};

const deleteReview = async (id, requesterId) => {
    if (!id || !requesterId) return { errCode: 1, errMessage: 'Missing parameters' };
    const review = await db.Review.findByPk(id);
    if (!review) return { errCode: 2, errMessage: 'Review not found' };
    if (review.patientId !== Number(requesterId)) {
        return { errCode: 3, errMessage: 'You may only delete your own review' };
    }
    await review.destroy();
    return { errCode: 0, errMessage: 'Deleted' };
};

module.exports = { createReview, getReviewsByDoctor, getReviewByBooking, deleteReview };
