const jwt = require("jsonwebtoken");
require('dotenv').config

const verifyToken = (req, res, next) => {
    let access_token = req.cookies.access_token;
    let refresh_token = req.cookies.refresh_token;
    try {
        if(!access_token){
         next();
        }
    
        jwt.verify(access_token, process.env.JWT_SECRET, (err, user) => {
            if(user){
                req.user = user;
                next()
            } else if(err){
                jwt.verify(refresh_token, process.env.JWT_SECRET,(err, user) => {
                    if(err) {
                        res.status(403).json({error: "You are logged out"})
                    }

                    const newAccessToken = jwt.sign(
                        {
                        id: user.id,
                        isAdmin: user.isAdmin,
                        isVerified: user.isVerified,
                        sessionId: user.sessionId
                        },
                        process.env.JWT_SECRET,
                        {expiresIn: "20m"}
                    )

                    const newRefreshToken = jwt.sign(
                        {
                        id: user.id,
                        isAdmin: user.isAdmin,
                        isVerified: user.isVerified,
                        sessionId: user.sessionId
                        },
                        process.env.JWT_SECRET,
                        {expiresIn: "20m"}
                    )

                    res.clearCookie("access_token")
                    res.clearCookie("refresh_token")

                    // Set Access Token Cookie
                    res.cookie("access_token", newAccessToken, {
                        maxAge: 30000, // 5 Mins
                        httpOnly: false,
                        secure: false,
                    });
            
                    // Set Refresh Token Cookie
                    res.cookie("refresh_token", newRefreshToken, {
                        maxAge: 3.154e10, // 1 Year
                        httpOnly: false,
                        secure: false,  
                    })

                    req.user = user
                })
                next();
            }
        });
    } catch (err) {
        next(err);
    }
}

const verifyAuth = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("You are not authorized")
        }
    })
}

const verifyAdmin = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not authorized")
            next()
        }
    })
}

module.exports = { verifyToken, verifyAuth, verifyAdmin }