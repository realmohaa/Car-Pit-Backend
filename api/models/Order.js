const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user_id: {
        type: String,
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
        required: true
    },

    address: {
        type: Object, // Includes All Address Info
        required: true,
    },

    status: {
        type: String,
        default: "Pending"
    }
    
}, {
    timestamps: true
})

module.exports = mongoose.model("Order", OrderSchema);