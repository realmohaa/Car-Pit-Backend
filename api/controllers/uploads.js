const multer = require("multer");
const path = require("path");

// Disk Storage Set Up
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./assets/profile_pictures");
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
    limits: { fileSize: 5000000 }
})

const uploadProfile = multer({
    storage: storage
});

module.exports = { uploadProfile }