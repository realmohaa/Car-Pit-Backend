const { string } = require("@hapi/joi");
const mongoose = require("mongoose");

const GarageSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    garage_id: {
        type: String,
        required: true
    },
    services: {
        type: Array,
        required: true,
    },
    legal_name: {
        type: String,
        required: true,
    },
    location: {
        country: String,
        region: String,
        street: String,
        postcode: String
    },
    working_hours: {
        start_time: String,
        close_time: String  
    },
    rating: {
        type: String
    },
    license_no: {
        type: String,
        required: true
    },
    contact_no: {
        type: String,
        required: true
    },
    subscription_rate: {
        type: Number,
        default: 5,
        required: true
    },
    garage_status: {
        type: String,
        enum: ['active', 'pending', 'disabled'],
        default: 'pending',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Garage", GarageSchema);