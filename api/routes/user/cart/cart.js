const router = require("express").Router();
const Cart = require("../../../models/Cart");

// Create Cart
router.post("/", async (req, res, next) => {
    const cart = await Cart.findOne({
        user_id: req.user.id,
    })

    if(cart){
        return res.status(208).json({
            message: "You already have a cart",
            cart
        });
    } else {
        const newCart = new Cart({
            user_id: req.user.id,
            ...req.body
        })
    }

    try {
        const savedCart = await newCart.save();
        return res.status(200).json(savedCart)
    } catch (err) {
        return res.status(500).json({error: err})
    }
})

// Get Cart
router.get("/", async (req, res,next) => {
    try {
        const cart = await Cart.findOne({userId: req.user.id});
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Update Cart
router.put("/", async (req, res,next) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.user.id, 
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
router.delete("/", async (req,res) => {
    try {
        await Cart.findByIdAndDelete(req.user.id);
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router