const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;
    
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
            if (err) res.status(403).json("The AccessToken is not valid!");
            req.user = user;
            next();
        });
    } else {
        res.status(401).json("you are not authenticated");
    }

}

const verifyAuth = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user.id || req.user.isAdmin) {
            next();
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
        }
    })
}

module.exports = { verifyToken, verifyAuth, verifyAdmin }