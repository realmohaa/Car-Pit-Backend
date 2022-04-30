const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        type: {},
        required: true
    },
    scheduled_date: {
        type: String,
        required: true,
    },
    client_description: {
        type: String,
        required: true,
    },
    vehicle_info: {
        type: {}
    },
    services: {
        type: [],
        required: true
    },
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    garage_id: {
        type: String,
        required: true,
    },
    products: [
        {
            product_id: {
                type: String
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    amount: {
        type: Number,
    },
    address: {
        type: Object, // Includes All Address Info
    },
    status: {
        type: String,
        default: "pending"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Order", OrderSchema);