const Joi = require("@hapi/joi");

const profileValidationScehma = Joi.object({
    first_name: Joi.string().min(3).max(18).lowercase(),
    last_name: Joi.string().min(3).max(18).lowercase(),
    phone_number: Joi.string().min(7).max(15),
});

module.exports = profileValidationScehma