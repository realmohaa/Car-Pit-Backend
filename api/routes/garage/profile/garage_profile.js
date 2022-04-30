const Garage = require("../../../models/Garage");
const CreateHTTPError = require('http-errors')
const router = require("express").Router();

// Fetch Garage Profile
router.get("/", async (req,res,next) => {
    try {
        const garage = await Garage.findOne({user_id: req.user.id});
        return res.status(200).json(garage);
    } catch (err) {
        next(CreateHTTPError(500, err));
    }
})

 
module.exports = router