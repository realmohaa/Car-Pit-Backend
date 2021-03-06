const router = require("express").Router();
const Product = require("../../../models/Product");
const aqp = require("api-query-params");
const createProductSchema = require("../../../validation/product_v_schema")

// All Products 
router.get("/", async (req,res) => {
    try {
        const { filter, skip, limit, sort, projection, population } = aqp(req.query);

        await Product.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, products) => {
              if (err) {
                return next(err);
              }
              res.status(200).json(products)
            });

    } catch (err) {
        res.status(500).json({error: err})
    }
})

// Create Product
router.post("/", async (req, res, next) => {
    const newProduct = new Product({
        user_id: req.user.id,
        ...req.body,
        profitInCurrency: req.body.retail_price - req.body.wholesale_price,
        profitPercentage: ((req.body.retail_price-req.body.wholesale_price)/req.body.wholesale_price*100).toFixed(2)
    });
    try {
        const Validator = await createProductSchema.validateAsync(req.body);
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct)
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err);
    }
})

// Update Product
router.put("/:userId", async (req, res,next) => {
    const userId = req.params.userId
    try {
        const Validator = await createProductSchema.validateAsync(req.body);

        if (Validator.error) {
          next(createError(500,Validator.error));
        } 

        const updatedProduct = await Product.findOneAndUpdate(
            {user_id: userId}, 
            {$set: req.body},
            {new: true}
        );
        const updtProd = updatedProduct._doc;
        res.status(200).json(updtProd);
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err)
    }
})

// Delete Product
router.delete("/:userId", async (req,res) => {
    const userId = req.params.userId
    try {
        await Product.findOneAndDelete({user_id: userId});
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
})

// Products Stats
router.get("/stats", async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await Product.aggregate([
        // Aggregating Needed Properties each month into 
        // an object indicating analytics info
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $addFields: {
            month: { $month: "$createdAt" },
            products: { $sum: 1 },
            retail_sales_total: { $sum: "$retail_price" },
            wholesales_total: { $sum: "$wholesale_price" },
            profit: { $sum: "$profitInCurrency" },
          },
        },
        {
          $group: {
            _id: "$month",
            products_counter: { $sum: "$products"},
            retailSales: { $sum: "$retail_sales_total" },
            whole_sales: { $sum: "$wholesales_total" },
            profits: { $sum: "$profit" },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router