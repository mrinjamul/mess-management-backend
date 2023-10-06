var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const adminAuthenticated = require("../../middlewares/adminAuthenticated");
const authenticated = require("../../middlewares/authenticated");

const {
  GetAllAttendance,
  CreateAttendance,
  GetCurrentAttendanceByMobile,
} = require("../../controllers/attendance");

// Get all attendences
router.get("/", adminAuthenticated, async function (req, res, next) {
  // get all attendance
  const attendances = await GetAllAttendance();
  if (!attendances) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "unable to fetch attendances from database",
      message: "Not found",
      data: [],
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: attendances,
  });
});

// Attend a day
router.get("/attend", authenticated, async (req, res, next) => {
  // get user payload from middleware
  const userPayload = req.user;
  if (!userPayload) {
    res.status(constants.http.StatusInternalServerError).json({
      status: false,
      error: "internal server error",
      message: "Failed to get user info",
      data: null,
    });
    return;
  }

  const attendance = await CreateAttendance(userPayload);

  if (!attendance) {
    res.status(constants.http.StatusInternalServerError).json({
      status: false,
      error: "internal server error",
      message: "Failed to create attendance",
      data: null,
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "attended successfully",
    data: attendance,
  });
});

// Get user current attendance
router.get("/:mobile", authenticated, async function (req, res, next) {
  // get mobile number
  const mobile = req.params.mobile;
  const attendance = await GetCurrentAttendanceByMobile(mobile);
  if (!attendance) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "unable to fetch attendances from database",
      message: "Not found",
      data: {
        user_mobile: mobile,
        lunch: false,
        dinner: false,
      },
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: attendance,
  });
});

module.exports = router;
