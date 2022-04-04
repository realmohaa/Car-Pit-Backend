const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js")
const jwt = require("jsonwebtoken")

// Registeration 
router.post("/register", async (req,res) => {
    if(req.body.username || req.body.email || req.body.password) {

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJs.AES.encrypt(
                req.body.password,
                process.env.ENCRYTION_SECRET
            ).toString(),
            first_name: req.body.first_name,
            last_name: req.body.last_name
        });

        try {
            const savedUser = await newUser.save();
            const {password, ...others } = savedUser._doc;
            res.status(201).json(others);
        } catch(err){
            res.status(500).json(err);
        }

    } else {
        res.status(401).json("Username, Password and Email Cannot be empty");
    }
})

// login 
router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({ username: req.body.username }).select('+password');
        !user && res.status(401).json("Wrong Credentials");
        if(user) {
            const encPass = CryptoJs.AES.decrypt(user.password, process.env.ENCRYTION_SECRET);
            const userPass = encPass.toString(CryptoJs.enc.Utf8);
    
            userPass !== req.body.password &&
             res.status(401).json("Please enter a valid password");

             const accessToken = jwt.sign(
                {
                 id: user.id,
                 isAdmin: user.isAdmin,
                 isVerified: user.isVerified
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            )

            const {password, ...others } = user._doc;
    
            return res.status(200).json({...others, accessToken}); 
        }
    } catch (err) {
        res.status(500).json("Login Failed")
    }
})

module.exports = router