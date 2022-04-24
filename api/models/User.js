const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    profile_image: {
        type: String,
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    first_name: {
        type: String
    },

    last_name: {
        type: String
    },

    phone_number: {
        type: String
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    account_type: {
        type: String,
        enum: ['user', 'admin', 'garage'],
        default: 'user'
    },

    isAdmin: {
        type: Boolean,
        default: false
    }
    
}, {
    timestamps: true
})



module.exports = mongoose.model("User", UserSchema);