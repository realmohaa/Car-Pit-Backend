const router = require("express").Router();
const CreateHTTPError = require("http-errors");
const aqp = require('api-query-params');
const Order = require('../../../models/Order');
const {sendAppointmentConfirmation} = require('../../../utils/mailer');
const User = require("../../../models/User");

// List All Garage Orders
router.get("/", async (req,res) => {
    try {
        const allOrders = await Order.find({user_id: req.user.id});
        return res.status(200).json(allOrders)
    } catch (err) {
        throw CreateHTTPError(500, err)
    }
})

// Approve Garage Order
router.put("/:orderId", async (req, res,next) => {
    const orderId = req.params.orderId;
    const { new_status } = req.body
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            {order_id: orderId}, 
            {$set: {status: new_status}},
            {new: true}
        );
        let body = 'Your order status has been changed to ' + new_status;
        const updtOrder = updatedOrder._doc;
        await sendAppointmentConfirmation(updtOrder.user.email, orderId, updtOrder.scheduled_date, body);
        res.status(200).json(updtOrder);
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});

// Delete Order
router.delete("/:orderId", async (req,res) => {
    const orderId = req.params.orderID
    try {
        await Order.findOneAndDelete({order_id: orderId});
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;