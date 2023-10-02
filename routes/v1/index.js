var express = require("express");
var router = express.Router();

var userRouter = require("./users");
var routineRouter = require("./routine");

const authenticated = require("../../middlewares/authenticated");

/* V1 API routes */

// user routes
router.use("/user", authenticated, userRouter);
router.use("/routine", authenticated, routineRouter);

module.exports = router;
