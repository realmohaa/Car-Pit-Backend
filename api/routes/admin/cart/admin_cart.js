const router = require("express").Router();
const { verifyAdmin } = require("../../../middleware/JWTVerifier")
const Cart = require("../../../models/Cart");

// All Carts 
router.get("/", verifyAdmin, async (req,res) => {
    try {
        const { filter, skip, limit, sort, projection, population } = aqp(req.query);

        await Cart.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, carts) => {
              if (err) {
                return next(err);
              }
              res.status(200).json(carts)
            });

    } catch (err) {
        res.status(500).json({error: err})
    }
})


module.exports = router