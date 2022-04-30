const Garage = require("../../../models/Garage");
const Service = require("../../../models/Service");
const CreateHTTPError = require('http-errors')
const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');
const aqp = require('api-query-params');
const { garageRegSchema } = require("../../../validation/auth_v_schema");
const createHttpError = require("http-errors");

// All Available Garages 
router.get("/", async (req,res) => {
    try {
        const allGarages = await Garage.find({"garage_status": "active"});
        return res.status(200).json(allGarages)
    } catch (err) {
        throw CreateHTTPError(500, err)
    }
})

// Fetch Services All Allowed Services 
router.get("/services/", async (req,res) => {
    try {
        const { filter, skip, limit, sort, projection, population } = aqp(req.query);
        Service.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, services) => {
              if (err) {
                return next(err);
              }
              res.status(200).json(services)
            });

    } catch (err) {
        res.status(500).json({error: err.toString()})
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

        const validator = await garageRegSchema.validateAsync(req.body);

        if (validator.error) {
            next(createHttpError(500,validator.error));
        } 

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
        if(err?.isJoi === true) err.status = 422
        next(err)
    }
})
 
module.exports = router