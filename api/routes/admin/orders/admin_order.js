const router = require("express").Router();
const Order = require("../../../models/Order");
const aqp = require("api-query-params");

// All Orders 
router.get("/", async (req,res) => {
    try {
        const { filter, skip, limit, sort, projection, population } = aqp(req.query);

        await Order.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, orders) => {
              if (err) {
                return next(err);
              }
              res.status(200).json(orders)
            });

    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Update Order
router.put("/", async (req, res,next) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.user.id, 
            {$set: req.body},
            {new: true}
        );
        const updtOrder = updatedOrder._doc;
        res.status(200).json(updtOrder);
    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Delete Order
router.delete("/", async (req,res) => {
    try {
        await Order.findByIdAndDelete(req.user.id);
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router