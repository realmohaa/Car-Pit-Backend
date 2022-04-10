const mongoose = require("mongoose");

const UserOTPverificationSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})



module.exports = mongoose.model("UserOTPVerification", UserOTPverificationSchema);