const router = require("express").Router();
const Car = require("../../../models/Car");
const CarsProvider = require("../../../providers/CarsProvider") 
const aqp = require('api-query-params')


// Create Car For A User
router.post("/", async (req, res, next) => {
    const { vin } = req.query;

    try {
        // Check if Car exists in customer cars
        const car = await Car.findOne({
            user_id: req.user.id,
            vin: vin
        })
        if(car){
            return res.status(208).json({
                message: "You already have this car added",
                car
            });
        }


        let creation_params = {};

        await new CarsProvider().fetchCar(vin, (params) => {
            creation_params = params
            console.log(params)
        });
 
        const newCar = new Car({
            user_id: req.user.id,
            vin: vin,
            ...creation_params
        })
        const savedCar = await newCar.save();
        console.log(savedCar)
        res.status(200).json(savedCar)
        // console.log(carDetails)
    } catch (e) {
        return res.status(500).json({error: e.toString()})
    }
})

// All Customer Cars 
router.get("/", async (req,res) => {
    try {
        const { filter, skip, limit, sort, projection, population } = aqp(req.query);

        await Car.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, cars) => {
              if (err) {
                return next(err);
              }
              res.status(200).json(cars)
            });

    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Get Car Data
router.get("/single/", async (req, res,next) => {
    try {
        const car = await Car.findOne({
            vin: req.query.vin
        });
        res.status(200).json(car);
    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Delete Car
router.delete("/", async (req,res) => {
    try {
        await Car.findOneAndDelete({
            userId: req.user.id,
            vin: req.query.vin
        });
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router