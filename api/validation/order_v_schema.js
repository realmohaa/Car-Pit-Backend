const Joi = require("@hapi/joi");

const orderValidationScehma = Joi.object({
    garage_id: Joi.string().required(),
    scheduled_date: Joi.string().required(),
    client_description: Joi.string().min(3).max(256).lowercase().required(),
    services: Joi.array().required(),
    vehicle_info: Joi.object().required(),
});

module.exports = orderValidationScehma