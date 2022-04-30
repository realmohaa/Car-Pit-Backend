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
        res.status(500).json({error: err});
    }
});

// Get Monthly Stats
router.get("/stats", async (req,res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));
    try {
        const data = await Order.aggregate([
            { $match: { createdAt: { $gte: prevMonth } } },
            {
              $project: {
                month: { $month: "$createdAt" },
                sales: "$amount"
              },
            },
            {
              $group: {
                _id: "$month",
                total: { $sum: "$sales" },
              },
            },
          ]);
          res.status(200).json(data)
    } catch (err){
        res.status(500).json({error: err});
    }
});

// Update Order
router.put("/:orderId", async (req, res,next) => {
    const orderId = req.params.orderId;
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            {order_id: orderId}, 
            {$set: req.body},
            {new: true}
        );
        const updtOrder = updatedOrder._doc;
        res.status(200).json(updtOrder);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

// Delete Order
router.delete("/:orderId", async (req,res) => {
    const orderId = req.params.orderId;
    try {
        await Order.findOneAndDelete({order_id: orderId});
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router