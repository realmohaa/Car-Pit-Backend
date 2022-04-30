const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
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

    total_amount: {
        type: Number,
        required: true
    }
    
}, {
    timestamps: true
})

module.exports = mongoose.model("Cart", CartSchema);