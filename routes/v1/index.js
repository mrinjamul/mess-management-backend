var express = require("express");
var router = express.Router();

var userRouter = require("./users");
var routineRouter = require("./routine");

/* V1 API routes */

// user routes
router.use("/user", userRouter);
router.use("/routine", routineRouter);

module.exports = router;
