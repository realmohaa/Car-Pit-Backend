const router = require("express").Router();
const Car = require("../../../models/Car");
const CarsProvider = require("../../../providers/CarsProvider");
const aqp = require('api-query-params');
const CreateHTTPError = require("http-errors");


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
        res.status(200).json(savedCar)
    } catch (e) {
        return next(e)
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
        throw CreateHTTPError(500, "Test")
    }
})

// Check Exisiting User Car History
router.get("/history", async(req,res, next) => {
    const { vin } = req.query;
    try {
        // Check if Car exists in customer cars
        const car = await Car.findOne({
            user_id: req.user.id,
            vin: vin
        })

        if(!car){
            return res.status(500).json({
                message: "Please Provide Your Own Car Details"
            });
        }

        let history = {};

        await new CarsProvider().carHistory(vin, (params) => {
            history = params
        })

        res.status(200).json(history)

    } catch(e) {
        next(e);
    }
})

// router.get("/whatCar/", async (req,res) => {
//     const url = req.body;
//     let searchResult;
//     try {
//         console.log(url)
//         await new CarsProvider().whatCarIsThat(url, (result) => {
//             searchResult = result
//         })
//         res.status(200).json(searchResult);
//     } catch (e) {
//         res.status(500).json({error: e.toString()})
//     }
// })

// Get Car Data
router.get("/single/", async (req, res,next) => {
    try {
        const car = await Car.findOne({
            user_id: req.user.id,
            vin: req.query.vin
        });
        
        if(!car){
            next(CreateHTTPError(404, "Car Not Found"))
        }

        res.status(200).json(car);
    } catch (e) {
        next(CreateHTTPError(500, "Test"))
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