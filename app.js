const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require('morgan');
const bodyParser = require("body-parser");

dotenv.config();


// Routes
const authRoute = require("./api/routes/auth");
// User Routes
const cartRoute = require("./api/routes/user/cart/cart");
const profileRoute = require("./api/routes/user/profile/profile");
// Admin Routes
const productAdminRoute = require("./api/routes/admin/product/product");
const profileAdminRoute = require("./api/routes/admin/profile/admin_profile");

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB is connected successfully");
    }).catch((err) => {
        console.log(err) ;
    })

// Use JSON
app.use(express.json());

// Use Morgan logging
app.use(morgan('dev'));

// Body Parser to extract urlEncoded Bodies to JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// Appending All Incoming requests with Headers to prevent CORS errs
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        // Supported Request Methods
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
})

// Request Handeling routes
app.use("/api/auth", authRoute);
// User Handeling Routes
app.use("/api/user/carts", cartRoute);
app.use("/api/user/profile", profileRoute);
// Admin Handeling Routes
app.use("/api/admin/products", productAdminRoute);
app.use("/api/admin/profile", profileAdminRoute);

// Global Errors Handeling 
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.stats || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(process.env.SERVICE_PORT || 6000, () => {
    console.log("Server is running successfully");
})