import Joi from 'joi';

const createBookingSchema = Joi.object({
    doctorId: Joi.number().integer().positive().required(),
    patientId: Joi.number().integer().positive().required(),
    date: Joi.alternatives().try(
        Joi.number().integer().positive(),
        Joi.string().pattern(/^\d+$/),
        Joi.date()
    ).required(),
    timeType: Joi.string().max(20).required(),
    reason: Joi.string().max(2000).allow('', null),
    paymentMethod: Joi.string().valid('CASH', 'BANK').default('CASH')
});

const cancelBookingSchema = Joi.object({
    bookingId: Joi.number().integer().positive().required(),
    patientId: Joi.number().integer().positive().required()
});

const createPaypalOrderSchema = Joi.object({
    bookingId: Joi.number().integer().positive().required()
    // amountUsd intentionally NOT accepted — server resolves authoritative price.
});

module.exports = { createBookingSchema, cancelBookingSchema, createPaypalOrderSchema };
