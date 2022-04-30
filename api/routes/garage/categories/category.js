const router = require("express").Router();
const CreateHTTPError = require("http-errors");
const Category = require('../../../models/Category');
const aqp = require('api-query-params');

// List All Garage Categories
router.get("/", async (req,res) => {
    try {
        const allCategories = await Category.find({user_id: req.user.id});
        return res.status(200).json(allCategories)
    } catch (err) {
        throw CreateHTTPError(500, err)
    }
})

// Create A New Category
router.post("/", async  (req, res, next) => {
    const { 
        category_name,
        desc,
        prefix,
        category_type
    } = req.body

    const newCategory = new Category({
        user_id: req.user.id,
        ...req.body
    })

    const cat = await newCategory.save();

    res.status(200).json(cat)

    try {
    } catch (e) {
        next(CreateHTTPError(500, e))
    }
});

// Delete Category
router.delete("/:_id", async (req,res) => {
    const catId = req.params._id
    try {
        await Category.findOneAndDelete({user_id: req.user.id, _id: catId});
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;