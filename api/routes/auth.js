const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const {registerationSchema, loginSchema} = require("../validation/auth_v_schema")

// Registeration 
router.post("/register", async (req,res, next) => {
    try {

        const { 
            username,
            email,
            password,
            first_name,
            last_name,
            phone_number
        } = req.body;

        const Validator = await registerationSchema.validateAsync(req.body);
        if(username || email || password) {
    
            const newUser = new User({
                username: username,
                email: email,
                password: CryptoJs.AES.encrypt(
                    password,
                    process.env.ENCRYTION_SECRET
                ).toString(),
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number,
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
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err);
    }
})

// login 
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const Validator = await loginSchema.validateAsync(req.body);

        const user = await User.findOne({ username: req.body.username }).select('+password');
        !user && res.status(401).json("Wrong Credentials");
        if(user) {
            const encPass = CryptoJs.AES.decrypt(user.password, process.env.ENCRYTION_SECRET);
            const userPass = encPass.toString(CryptoJs.enc.Utf8);
    
            userPass !== req.body.password &&
             res.status(401).json({message: "Please enter a valid password"});

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
    
            return res.status(200).json({
                ...others,
                accessToken
            });
        }
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err)
    }
})

module.exports = router