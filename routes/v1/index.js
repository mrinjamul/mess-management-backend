var express = require("express");
var router = express.Router();

const userRouter = require("./users");
const routineRouter = require("./routine");
const attendanceRouter = require("./attendence");
const transactionRouter = require("./transaction");
const moneyRouter = require("./money");
const billRouter = require("./bill");
const managerRouter = require("./manager");

/* V1 API routes */

// user routes
router.use("/user", userRouter);
router.use("/routine", routineRouter);
router.use("/attendance", attendanceRouter);
router.use("/transaction", transactionRouter);
router.use("/money", moneyRouter);
router.use("/bill", billRouter);
router.use("/manager", managerRouter);

module.exports = router;
