const router = require("express").Router();
const { verifyAuth, verifyAdmin } = require("../middleware/JWTVerifier")
const CryptoJs = require("crypto-js");
const User = require("../models/User");
const aqp = require("api-query-params");

// All users 
router.get("/", verifyAdmin, async (req,res) => {
    try {
        const { filter, skip, limit, sort, projection, population } = aqp(req.query);

        await User.find(filter)
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, users) => {
              if (err) {
                return next(err);
              }
              res.status(200).json(users)
            });

    } catch (err) {
        res.status(500).json({error: err})
    }
})

// User
router.get("/:id", verifyAuth, async(req,res) => {
    try {
        await User.findById(req.params.id)
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