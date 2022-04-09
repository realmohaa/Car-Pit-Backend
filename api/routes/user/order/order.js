const router = require("express").Router();
const Order = require("../../../models/Order");
const { uuid } = require('uuidv4');

// Create Order
router.post("/", async (req, res, next) => {
    const newOrder = new Order({
        order_id: uuid(),
        ...req.body,
        user_id: req.user.id
    });

    try {
        const savedOrder = await newOrder.save();
        return res.status(200).json(savedOrder)
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