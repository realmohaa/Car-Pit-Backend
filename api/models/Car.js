const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    vin: {
        type: String,
        unique: true
    },
    make: {type: String,},
    model: {type: String,},
    engine: {type: String,},
    engine_cylinders: {type: String,},
    year: {type: Number,},
    style: {type: String,},
    type: {type: String,},
    size: {type: String,},
    made_in: {type: String,},
    fuel_capacity: {type: String,},
    city_mileage: {type: String,},
    highway_mileage: {type: String,},
    retail_price: {type: String,},
}, {
    timestamps: true
})

module.exports = mongoose.model("Car", CarSchema);