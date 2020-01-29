const express = require("express");
const router = express.Router();
// const db = require("../../JoinRoutes");

//Items model
// const Inventory = require("../../../models/Inventory");
// const Log = require("../../../models/Log");

// router.post("/tutorial", (req, res) => {
//     const create = function(tutorial) {
//         return db.Tutorial.create(tutorial).then(data => {
//             console.log("\n>> Created Tutorial:\n", data);
//             res.status(200).json({ success: true, data });
//             res.status(400).json({ success: false });
//         });
//     };
//
// });

router.get("/", async (req, res) => {
    // querying all employees
    res.render('register/register.ejs');
});

module.exports = router;
