const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

// JWT Role Verification Middleware
const { verifyAuth, verifyAdmin, verifyGarage } = require("./api/middleware/JWTVerifier");

// Auth Route
const authRoute = require("./api/routes/auth");
// User Routes
const cartRoute = require("./api/routes/user/cart/cart");
const profileRoute = require("./api/routes/user/profile/profile");
const orderRoute = require("./api/routes/user/order/order");
const carRoute = require("./api/routes/user/car/car");
const garageRoute = require("./api/routes/user/garage/garage");
// Admin Routes
const productAdminRoute = require("./api/routes/admin/products/product");
const profileAdminRoute = require("./api/routes/admin/profiles/admin_profile");
const orderAdminRoute = require("./api/routes/admin/orders/admin_order");
const cartAdminRoute = require("./api/routes/admin/carts/admin_cart");
const garageAdminRoute = require("./api/routes/admin/garages/admin_garage");
// Garage Routes
const garageCategoryRoute = require("./api/routes/garage/categories/category.js");

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
// Cookie Parser
app.use(cookieParser());

// Using CORS
app.use(cors({ origin: 'http://localhost:3000', withCredentials: true, credentials: true }));

// // Appending All Incoming requests with Headers to prevent CORS errs
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "*");
//     if (req.method === "OPTIONS") {
//         // Supported Request Methods
//         res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
//         return res.status(200).json({});
//     }
//     next();
// })

// Request Handeling routes
app.use("/api/auth", authRoute);

// User Handeling Routes
app.use("/api/user/", verifyAuth);
app.use("/api/user/carts", cartRoute);
app.use("/api/user/profile", profileRoute);
app.use("/api/user/order", orderRoute);
app.use("/api/user/cars", carRoute);
app.use("/api/user/garage", garageRoute);

// Admin Handling Routes
app.use("/api/admin/", verifyAdmin);
app.use("/api/admin/products", productAdminRoute);
app.use("/api/admin/profiles", profileAdminRoute);
app.use("/api/admin/orders", orderAdminRoute);
app.use("/api/admin/carts", cartAdminRoute);
app.use("/api/admin/garages", garageAdminRoute);

// Garage Handeling Routes
app.use("/api/garage/", verifyGarage);
app.use("/api/garage/categories/", garageCategoryRoute);

// Global Errors Handeling 
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

app.listen(process.env.SERVICE_PORT || 6000, () => {
    console.log("Server is running successfully");
});