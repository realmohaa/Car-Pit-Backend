const router = require("express").Router();
const CryptoJs = require("crypto-js");
const User = require("../../../models/User");

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

module.exports = router