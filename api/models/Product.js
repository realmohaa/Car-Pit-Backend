const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    desc: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    color: {type: [],},
    size: {type: [],},
    stock: {type: Number,},
    retail_price: {
        type: Number,
        required: true,
    },
    wholesale_price: {
        type: Number,
        required: true,
    },
    profitInCurrency: {
        type: Number,
        percentage: Number
    },
    profitPercentage: {
        type: Number,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Product", ProductSchema);