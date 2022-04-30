const router = require("express").Router();
const Car = require("../../../models/Car");
const CarsProvider = require('../../../providers/CarsProvider');

// Fetches car data using its VIN
router.get("/", async (req, res, next) => {
    const { vin } = req.query;
    try {
        let creation_params = {};
        await new CarsProvider().fetchCar(vin, (params) => {
            creation_params = params
            console.log(params)
        });
        res.status(200).json(creation_params)
    } catch (e) {
        return next(e)
    }
})

// Check Exisiting User Car History
router.get("/history", async(req,res, next) => {
    const { vin } = req.query;
    try {
        let history = {};
        await new CarsProvider().carHistory(vin, (params) => {
            history = params
        })
        res.status(200).json(history)
    } catch(e) {
        next(e);
    }
})

// Market Value
router.get("/market/", async (req, res, next) => {
    const { vin } = req.query;
    try {
        let creation_params = {};
        await new CarsProvider().getMarketDetails(vin, (params) => {
            creation_params = params
            console.log(params)
        });
        res.status(200).json(creation_params)
    } catch (e) {
        return next(e)
    }
})

// Plate Decoder
router.get("/decoder/", async (req, res, next) => {
    const { plate, state } = req.query;
    try {
        let creation_params = {};
        await new CarsProvider().plateDecoder(plate, state, (params) => {
            creation_params = params
            console.log(params)
        });
        res.status(200).json(creation_params)
    } catch (e) {
        return next(e)
    }
})

module.exports = router