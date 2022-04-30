const router = require("express").Router();
const Garage = require("../../../models/Garage");
const CreateHTTPError = require('http-errors')
const aqp = require('api-query-params');
const User = require("../../../models/User");

// All Available Garages
router.get("/", async (req,res, next) => {
    try {
        const { filter, skip, limit, sort, projection, population } = aqp(req.query);

        await Garage.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, garages) => {
              if (err) {
                return next(err);
              }
              res.status(200).json(garages)
            });

    } catch (err) {
        next(CreateHTTPError(500, err))
    }
})

// Approve Garage
router.put("/approve/:userId", async (req, res,next) => {
    const userId = req.params.userId;
    try {
        const updatedGarage = await Garage.findOneAndUpdate(
            {user_id: userId}, 
            {$set: {garage_status: 'active'}},
            {new: true}
        );

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {$set: {accountType: 'garage'}},
            {new: true}
        );
        
        const updtGarage = updatedGarage._doc;
        const updtUser = updateUser._doc;
        res.status(200).json({...updtUser, ...updtGarage});
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err)
    }
})

module.exports = router