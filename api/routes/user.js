const router = require("express").Router();
const { verifyAuth, verifyAdmin } = require("../middleware/JWTVerifier")
const CryptoJs = require("crypto-js");
const User = require("../models/User");

// All users 
router.get("/", verifyAdmin, async (req,res) => {
    const allUsers = await User.find().select('-password')
    res.status(200).json(allUsers)
})

// User
router.get("/:id", verifyAuth, async(req,res) => {
    try {

    } catch (err) {
        res.status(500).status
    }
})

// Update User
router.put("/:id", verifyAuth, async (req,res) => {
    if(req.body.password) {
        req.body.password = CryptoJs.AES.encrypt(
            req.body.password,
            process.env.ENCRYTION_SECRET
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body},
            {new: true}
        );
        const {password, ...others } = updatedUser._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Delete User
router.delete("/:id", verifyAuth, async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
})




module.exports = router