const router = require("express").Router();
const CreateHTTPError = require("http-errors");
const Service = require('../../../models/Service');
const aqp = require('api-query-params');

// Create A New Service
router.post("/", async  (req, res, next) => {
    const { 
        service_name,
        description,
        prefix
    } = req.body

    const newService = new Service({
        user_id: req.user.id,
        ...req.body
    })

    const service = await newService.save();
    res.status(200).json(service)
    try {
    } catch (e) {
        next(CreateHTTPError(500, e))
    }
});

// Update Service
router.put("/", async  (req, res, next) => {
    try {
        const updatedService = await Service.findOneAndUpdate(
            {user_id: req.user.id}, 
            {$set: req.body},
            {new: true}
        );
        const updtService = updatedService._doc;
        res.status(200).json(updtService);
    } catch (e) {
        next(CreateHTTPError(500, e))
    }
});

// Delete Service
router.delete("/", async (req,res,next) => {
    try {
        await Service.findOneAndDelete({user_id: req.user.id});
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (e) {
        next(CreateHTTPError(500, e))
    }
})

module.exports = router;