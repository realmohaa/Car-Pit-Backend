const router = require("express").Router();
const CryptoJs = require("crypto-js");
const User = require("../../../models/User");
const UserOTPVerification = require("../../../models/UserOTPVerification");

// Get Profile
router.get("/", async(req,res) => {
    try {
        await User.findById(req.user.id)
            .exec()
            .then(doc => {
                res.status(200).json(doc); 
            })
            .catch((err) => {
                res.status(500).json({error: err});
            })
    } catch (err) {
        res.status(500).json({error: err})
    }
})

router.put("/verify", async (req,res) => {
    const { otp } = req.body;
    try {
        
        if(req.user.isVerified){
            return res.status(403).json({message: "Your account is already verified!"})
        }

        const otpVerification = await UserOTPVerification.findOne({user_id: req.user.id});
        
        const encOtp = CryptoJs.AES.decrypt(otpVerification.otp, process.env.ENCRYTION_SECRET);
        const originalOtp = encOtp.toString(CryptoJs.enc.Utf8);

        if(otp === originalOtp){
            await User.findByIdAndUpdate(
                req.user.id,
                {$set: {isVerified: true}},
                {new: true}
            )
            return res.status(200).json({message: "Your account is verified successfully!"})
        } 
        return res.status(200).json({message: "The OTP Code Entered is Invalid"})
    } catch(err) {
        return res.status(403).json({error: err})
    }
})

// Update Profile
router.put("/", async (req,res) => {
    if(req.body.password) {
        req.body.password = CryptoJs.AES.encrypt(
            req.body.password,
            process.env.ENCRYTION_SECRET
        ).toString();
    } else if (req.body.isAdmin) {
        return res.status(401).json({message: "Status Cannot be edited"});
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            {$set: req.body},
            {new: true}
        );
        const {password, ...others } = updatedUser._doc;
        return res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Delete User
router.delete("/", async (req,res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
})

// Logout
router.post("/logout", async (req,res) => {
    try {
        // Set Access Token Cookie
        res.cookie("access_token", null, {
            maxAge: 0,
            httpOnly: true,
            secure: false,
            path: "/",
        });

        // Set Refresh Token Cookie
        res.cookie("refresh_token", null, {
            maxAge: 0,
            httpOnly: true,
            secure: false,  
        })
        res.status(200).json({Status: "logged out Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router