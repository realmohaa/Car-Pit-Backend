const router = require("express").Router();

router.get("/user", (req,res) => {
    res.send("Test good")
})

router.post("/user", (req,res) => {
    const username = req.body.username
    res.send("Hello " + username)
})

module.exports = router