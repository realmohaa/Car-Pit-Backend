const Joi = require('@hapi/joi');

const createProductSchema = Joi.object({
    title: Joi.string().min(6).max(36).lowercase().required(),
    img: Joi.string().min(6).max(256).lowercase(),
    desc: Joi.string().min(6).max(256).lowercase(),
    category: Joi.string().min(3).max(22).lowercase(),
    retail_price: Joi.number(),
    wholesale_price: Joi.number(),
    color: Joi.array(),
    size: Joi.array(),
})

module.exports = createProductSchema;