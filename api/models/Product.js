const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    img: {
        type: String,
        required: true,
    },

    desc: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    color: {
        type: String,
    },

    size: {
        type: String,
    },

    stock: {
        type: Number,
    },

    price: {
        type: Number,
        required: true,
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Product", ProductSchema);