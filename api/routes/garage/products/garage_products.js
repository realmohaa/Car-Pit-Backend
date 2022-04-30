const router = require("express").Router();
const createHTTPError = require("http-errors");
const Product = require("../../../models/Product");
const createProductSchema = require("../../../validation/product_v_schema")

// All Products 
router.get("/", async (req,res,next) => {
    try {
        const allProducts = await Product.find({user_id: req.user.id});
        return res.status(200).json(allProducts);
    } catch (err) {
        next(CreateHTTPError(500, err))
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

        if (Validator.error) {
            next(CreateHTTPError(500,Validator.error));
        } 

        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct)
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err);
    }
})

// Update Product
router.put("/:_id", async (req,res,next) => {
    const productId = req.params._id
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId, 
            {$set: req.body},
            {new: true}
        );
        const updtProd = updatedProduct._doc;
        res.status(200).json(updtProd);
    } catch (err) {
        next(createHTTPError(500, err))
    }
})

// Delete Product
router.delete("/:_id", async(req,res, next) => {
    const productId = req.params._id
    try {
        await Product.findByIdAndDelete(productId);
        res.status(200).json({Status: "Deleted Successfully"});
    } catch (err) {
        next(createHTTPError(500, err))
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
        next(createHTTPError(500, err))
    }
  });

module.exports = router