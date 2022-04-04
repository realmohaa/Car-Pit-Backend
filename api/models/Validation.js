const Joi = require("@hapi/joi");

const authSchema = Joi.object({
    username: Joi.string().min(3).lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required()
});

module.exports = { authSchema }