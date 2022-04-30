const router = require("express").Router();
const Car = require("../../../models/Car");
const aqp = require("api-query-params");

// All Cars 
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

module.exports = router