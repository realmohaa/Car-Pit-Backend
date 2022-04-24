const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const {registerationSchema, loginSchema} = require("../validation/auth_v_schema");
const { createSession } = require("../controllers/session_controller");
const { sendOTPEmail } = require("../utils/otpHandeler");
const createError = require('http-errors');
const { uploadProfile } = require("../controllers/uploads");
const Garage = require("../models/Garage");

// Registeration 
router.post("/register", uploadProfile.single("profile_image"), async (req,res, next) => {
    const { 
        username,
        email,
        password,
        first_name,
        last_name,
        phone_number,
        account_type
    } = req.body;

    try {
        const exisitingUser = await User.findOne({email: email, username: username});

        if(exisitingUser){
            return res.status(422).json({error:{message: "Account Exists"}})
        }

        const Validator = await registerationSchema.validateAsync(req.body);

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
            isVerified: false,
            account_type: account_type,
            profile_image: req.file === undefined ? 'default.png'  : req.file.filename
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
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err);
    }
});

// login 
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const Validator = await loginSchema.validateAsync(req.body);
        if (Validator.error) {
            next(createError(500,Validator.error));
           } 
        const user = await User.findOne({ username: username }).select('+password');
        !user && res.status(401).json({error:{message: "Please enter a valid email and password"}});
        
        if(user) {
            const encPass = CryptoJs.AES.decrypt(user.password, process.env.ENCRYTION_SECRET);
            const userPass = encPass.toString(CryptoJs.enc.Utf8);

            userPass !== password &&
             res.status(401).json({error:{message: "Please enter a valid password"}});

            const session = createSession(user.username)

            const access_token = jwt.sign(
                {
                 id: user.id,
                 isAdmin: user.isAdmin,
                 isVerified: user.isVerified,
                 accountType: user.accountType,
                 sessionId: session.sessionId
                },
                process.env.JWT_SECRET,
                {expiresIn: "5m"}
            );

            const refresh_token = jwt.sign(
                {
                    id: user.id,
                    isAdmin: user.isAdmin,
                    isVerified: user.isVerified,
                    accountType: user.accountType,
                    sessionId: session.sessionId
                },
                process.env.JWT_SECRET,
                {expiresIn: "15m"}
            );

            res.cookie("access_token", access_token, {
                maxAge: 300000, // 5 Mins
                httpOnly: true,
                secure: false,
                path: "/",
            })

            res.cookie("refresh_token", refresh_token, {
                maxAge: 300000, // 5 Mins
                httpOnly: true,
                secure: false,
            })

    
            return res.status(200).json({
                session
            });
        }
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err)
    }
});

module.exports = router