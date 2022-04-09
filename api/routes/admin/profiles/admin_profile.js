const router = require("express").Router();
const User = require("../../../models/User");
const aqp = require("api-query-params");

// All users 
router.get("/", async (req,res) => {
    try {
        const { filter, skip, limit, sort, projection, population } = aqp(req.query);

        await User.find(filter)
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, users) => {
              if (err) {
                return next(err);
              }
              res.status(200).json(users)
            });

    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Users Stats
router.get("/stats", async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router