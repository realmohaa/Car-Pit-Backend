const nodemailer = require("nodemailer");
const CryptoJs = require("crypto-js");
const UserOTPVerification = require("../models/UserOTPVerification");

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_EMAIL_PASS
    }
});

const sendOTPEmail = async (email,userId) => {
    try {    
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`

        const hashedOtp = CryptoJs.AES.encrypt(
            otp,
            process.env.ENCRYTION_SECRET
        ).toString();

        const options = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "OTP Verification",
            text: `${otp}`
        }
        
        await transporter.sendMail(options, (err, info) => {
            if(err){
                console.log(err)
                return;
            }

            const newOTP = new UserOTPVerification({
                user_id: userId,
                otp: hashedOtp
            })
            newOTP.save().then(res=>{console.log(res)});
            console.log("Sent: " + info.response)
        })
    } catch (err) {
        next(err);
    }
}

const sendAppointmentConfirmation = async (email, order_id, scheduled_date, body ) => {
    try {    
        const options = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Appointment Confirmation",
            text: body
        }
        
        await transporter.sendMail(options, (err, info) => {
            if(err){
                console.log(err)
                return;
            }
        })
    } catch (err) {
        next(err);
    }
}

module.exports = {sendOTPEmail, sendAppointmentConfirmation}