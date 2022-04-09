const router = require("express").Router();
const Order = require("../../../models/Order");

// Create Order
router.post("/", async (req, res, next) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Get Order
router.get("/", async (req, res,next) => {
    try {
        const order = await Order.findOne({userId: req.user.id});
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({error: err})
    }
})

module.exports = router