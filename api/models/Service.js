const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    service_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Service", ServiceSchema);