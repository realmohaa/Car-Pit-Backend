const Joi = require("@hapi/joi");

const registerationSchema = Joi.object({
    username: Joi.string().min(3).lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
    first_name: Joi.string().min(2),
    last_name: Joi.string().min(3),
    phone_number: Joi.string().min(7).max(15),
});

const loginSchema = Joi.object({
    username: Joi.string().min(3).lowercase().required(),
    password: Joi.string().min(8).required()
});

module.exports = {
    registerationSchema,
    loginSchema
}