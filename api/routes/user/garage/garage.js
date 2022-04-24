const Garage = require("../../../models/Garage");
const CreateHTTPError = require('http-errors')
const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');

// All Available Garages 
router.get("/", async (req,res) => {
    try {
        const allGarages = await Garage.find({garage_status: 'active'});
        return res.status(200).json(allGarages)
    } catch (err) {
        throw CreateHTTPError(500, err)
    }
})

// Garage Registeration
router.post('/register', async (req,res,next) => {
    const { 
        legal_name,
        services,
        location,
        license_no,
        contact_no
    } = req.body;
    try {
        const existing_garage = await Garage.findOne({user_id: req.user.id});

        if(existing_garage){
            return next(CreateHTTPError(408, "Garage Profile Already Exisits"))
        }

        const newGarage = new Garage({
            user_id: req.user.id,
            garage_id: uuidv4(),
            ...req.body
        })

        await newGarage.save().then(result => {
            return res.status(200).json(result)
        })

    } catch (err) {
        console.log(err)
    }
})
 
module.exports = router