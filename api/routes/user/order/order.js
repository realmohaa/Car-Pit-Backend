const router = require("express").Router();
const Order = require("../../../models/Order");
const User = require('../../../models/User')
const orderValidationScehma = require('../../../validation/order_v_schema')
const { v4: uuidv4 } = require('uuid');
const CreateHTTPError = require("http-errors");
const aqp = require("api-query-params");

// All Orders 
router.get("/", async (req,res) => {
    try {
        const userFilter = `&user.id=${req.user.id}`
        // console.log(`${req.query.}${userFilter}`);
        const { filter, skip, limit, sort, projection, population } = aqp(req.query);
        filter["user.id"] = req.user.id

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
              return res.status(200).json(orders)
            });

    } catch (err) {
        return res.status(500).json({error: err});
    }
});

// Create Order
router.post("/", async (req, res, next) => {
    const {
        garage_id,
        client_description,
        scheduled_date,
        services,
        vehicle_info,
    } = req.body

    const {
        id,
        username,
        phone,
        email
    } = req.user
    
    try {
        const Validator = await orderValidationScehma.validateAsync(req.body);
    
        if (Validator.error) {
            next(createError(500,Validator.error));
        }
        
        const orderId = uuidv4();

        const newOrder = new Order({
            order_id: orderId,
            ...req.body,
            user: {
                id,
                username,
                phone,
                email
            }
        });

        const savedOrder = await newOrder.save();

        await User.findByIdAndUpdate(
            req.user.id, 
            {$push: {"orders": orderId}},
            {new: true}
        ).catch(e => {
            next(CreateHTTPError(500,e))
        })

        return res.status(200).json(savedOrder)
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err);
    }
})

// Get Order
router.get("/:orderId", async (req, res,next) => {
    const orderId = req.params.orderId
    try {
        const order = await Order.findOne({
            userId: req.user.id, 
            order_id: orderId
        });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Reschedule Order
router.put("/reschedule/:orderId", async (req,res,next) => {
    const orderId = req.params.orderId;
    const { new_date } = req.body
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            {order_id: orderId}, 
            {$set: {scheduled_date: new_date}},
            {new: true}
        );
        const updtdOrder = updatedOrder._doc;
        return res.status(200).json(updtdOrder);
    } catch (err) {
        if(err?.isJoi === true) err.status = 500
        next(err)
    }
})

// Delete Order
router.delete("/:orderId", async (req,res,next) => {
    const orderId = req.params.orderId;
    try {
        await Order.findOneAndDelete({order_id: orderId});
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        next(CreateHTTPError(500,err))
    }
});

module.exports = router