const Joi = require("@hapi/joi");

const registerationSchema = Joi.object({
    profile_image: Joi.string().optional(),
    username: Joi.string().min(3).max(10).lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
    first_name: Joi.string().min(2).max(8),
    last_name: Joi.string().min(3).max(8),
    phone_number: Joi.string().min(7).max(15),
    account_type: Joi.string(),
});

const loginSchema = Joi.object({
    username: Joi.string().min(3).lowercase().required(),
    password: Joi.string().min(8).required()
});

const garageRegSchema = Joi.object({
    legal_name: Joi.string().min(3).max(18).lowercase().required(),
    location: Joi.object().required(),
    license_no: Joi.string().min(3).max(18).lowercase().required(),
    contact_no: Joi.string().min(3).max(18).lowercase().required(),
    services: Joi.array().required(),
});

module.exports = {
    registerationSchema,
    loginSchema,
    garageRegSchema
}