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
                        res.cookie({path: '/'})
                    }

                    res.clearCookie("access_token")
                    res.clearCookie("refresh_token")

                    const newAccessToken = jwt.sign(
                        {
                        id: user.id,
                        isAdmin: user.isAdmin,
                        isVerified: user.isVerified,
                        sessionId: user.sessionId
                        },
                        process.env.JWT_SECRET,
                        {expiresIn: "5m"}
                    )

                    const newRefreshToken = jwt.sign(
                        {
                        id: user.id,
                        isAdmin: user.isAdmin,
                        isVerified: user.isVerified,
                        sessionId: user.sessionId
                        },
                        process.env.JWT_SECRET,
                        {expiresIn: "15m"}
                    )

                    // Set Access Token Cookie
                    res.cookie("access_token", newAccessToken, {
                        maxAge: 300000, // 5 Mins
                        httpOnly: true,
                        secure: false,
                        path: "/",
                    });
            
                    // Set Refresh Token Cookie
                    res.cookie("refresh_token", newRefreshToken, {
                        maxAge: 300000, // 5 Mins
                        httpOnly: true,
                        secure: false,  
                    })
                    console.log("refreshed")
                    req.user = user
                })
                next();
            }
        });
    } catch (err) {
        next("err");
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