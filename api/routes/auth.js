const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const {registerationSchema, loginSchema} = require("../validation/auth_v_schema");
const { createSession } = require("../controllers/session_controller");
const { sendOTPEmail } = require("../utils/otpHandeler");

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
                isVerified: false
            });
    
            try {
                const savedUser = await newUser
                    .save()
                    .then((result) => {
                        console.log(result);
                        sendOTPEmail(result.email,result._id, next);
                        return res.status(201).json(result);
                    });
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

        const user = await User.findOne({ username: username }).select('+password');
        !user && res.status(401).json("Wrong Credentials");
        if(user) {
            const encPass = CryptoJs.AES.decrypt(user.password, process.env.ENCRYTION_SECRET);
            const userPass = encPass.toString(CryptoJs.enc.Utf8);

            userPass !== password &&
             res.status(401).json({message: "Please enter a valid password"});

            const session = createSession(user.username)

            const refresh_token = jwt.sign(
                {
                    id: user.id,
                    isAdmin: user.isAdmin,
                    isVerified: user.isVerified,
                    sessionId: session.sessionId
                },
                process.env.JWT_SECRET,
                {expiresIn: "20m"}
            );

            const access_token = jwt.sign(
                {
                 id: user.id,
                 isAdmin: user.isAdmin,
                 isVerified: user.isVerified,
                 sessionId: session.sessionId
                },
                process.env.JWT_SECRET,
                {expiresIn: "10m"}
            );

            // Set Access Token Cookie
            res.cookie("access_token", access_token, {
                maxAge: 30000, // 5 Mins
                httpOnly: false,
                secure: false,
            });

            // Set Refresh Token Cookie
            res.cookie("refresh_token", refresh_token, {
                maxAge: 30000, // 1 Year
                httpOnly: false,
                secure: false,
            })
    
            return res.status(200).json({
                session,
                auth: { 
                    access_token,
                    refresh_token
                }
            });
        }
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err)
    }
})

module.exports = router