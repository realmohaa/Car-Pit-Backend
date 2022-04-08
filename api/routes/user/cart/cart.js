const router = require("express").Router();
const { verifyAuth, verifyToken } = require("../../../middleware/JWTVerifier")
const Cart = require("../../../models/Cart");

// Create Cart
router.post("/", verifyAuth, async (req, res, next) => {
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Get Cart
router.get("/:id", verifyAuth, async (req, res,next) => {
    try {
        const cart = await Cart.findOne({userId: req.params.id});
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Update Cart
router.put("/:id", verifyAuth, async (req, res,next) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body},
            {new: true}
        );
        const updtCart = updatedCart._doc;
        res.status(200).json(updtCart);
    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Delete Cart
router.delete("/:id", verifyAuth, async (req,res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router