const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    category_name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    },
    category_type: {
        type: String,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Category", CategorySchema);