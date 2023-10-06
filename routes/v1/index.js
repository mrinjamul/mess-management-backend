var express = require("express");
var router = express.Router();

var userRouter = require("./users");
var routineRouter = require("./routine");
var attendanceRouter = require("./attendence");

/* V1 API routes */

// user routes
router.use("/user", userRouter);
router.use("/routine", routineRouter);
router.use("/attendance", attendanceRouter);

module.exports = router;
