const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require('morgan');

dotenv.config();

const userRoute = require("./api/routes/user");
const authRoute = require("./api/routes/auth");

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
app.use(morgan('dev'))

// Request Handeling routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

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