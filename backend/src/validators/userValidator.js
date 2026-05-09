import Joi from 'joi';

// Patient self-registration: roleId is forced to R3 server-side, never accepted from client.
const registerSchema = Joi.object({
    email: Joi.string().email().max(120).required(),
    password: Joi.string().min(6).max(128).required(),
    firstName: Joi.string().max(60).allow('', null),
    lastName: Joi.string().max(60).allow('', null),
    address: Joi.string().max(255).allow('', null),
    phonenumber: Joi.string().max(20).allow('', null),
    phoneNumber: Joi.string().max(20).allow('', null),
    gender: Joi.alternatives().try(
        Joi.string().valid('M', 'F', '0', '1', 'true', 'false'),
        Joi.boolean()
    ).allow(null)
});

const loginSchema = Joi.object({
    email: Joi.string().email().max(120).required(),
    password: Joi.string().min(1).max(128).required()
});

// Admin-only create. roleId free.
const createNewUserSchema = Joi.object({
    email: Joi.string().email().max(120).required(),
    password: Joi.string().min(6).max(128).required(),
    firstName: Joi.string().max(60).allow('', null),
    lastName: Joi.string().max(60).allow('', null),
    address: Joi.string().max(255).allow('', null),
    phoneNumber: Joi.string().max(20).allow('', null),
    gender: Joi.alternatives().try(Joi.string().valid('0', '1'), Joi.boolean(), Joi.number().valid(0, 1)).allow(null),
    roleId: Joi.string().valid('R1', 'R2', 'R3').required(),
    positionId: Joi.string().max(20).allow('', null),
    image: Joi.string().allow('', null)
});

// Edit. roleId allowed only if the caller is admin (enforced at controller level
// after this validator passes — base shape is permissive).
const editUserSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    firstName: Joi.string().max(60).allow('', null),
    lastName: Joi.string().max(60).allow('', null),
    address: Joi.string().max(255).allow('', null),
    phoneNumber: Joi.string().max(20).allow('', null),
    gender: Joi.alternatives().try(
        Joi.string().valid('M', 'F', '0', '1', 'true', 'false', ''),
        Joi.boolean(),
        Joi.number().valid(0, 1)
    ).allow(null),
    roleId: Joi.string().valid('R1', 'R2', 'R3').optional(),
    positionId: Joi.string().max(20).allow('', null),
    image: Joi.string().allow('', null)
});

module.exports = { registerSchema, loginSchema, createNewUserSchema, editUserSchema };
