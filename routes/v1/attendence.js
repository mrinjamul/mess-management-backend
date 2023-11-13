var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const adminAuthenticated = require("../../middlewares/adminAuthenticated");
const authenticated = require("../../middlewares/authenticated");

const {
  GetAllAttendance,
  CreateAttendance,
  GetCurrentAttendanceByMobile,
  CreateAttendanceByAdmin,
} = require("../../controllers/attendance");

// import utils
const utils = require("../../helpers/utils");

// Get all attendences
router.get("/", adminAuthenticated, async function (req, res, next) {
  // get queries
  // Parse query parameters with default values
  const {
    page = 1,
    limit = 10,
    offset = 0, // Default to offset of 0 if not specified
    dateStart,
    dateEnd,
    sortBy = "created_at",
    orderBy = "desc",
    ...filters
  } = req.query;

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

  //  Apply filters dynamically
  const filteredItems = attendances.filter(
    utils.getFilter(filters, dateStart, dateEnd)
  );

  // Sort items based on sortBy and orderBy
  const sortedItems = filteredItems.sort(utils.getSorter(sortBy, orderBy));

  //  Calculate the skip value based on both page and offset
  const skip = (page - 1) * limit + parseInt(offset);
  // Slice the items to get the paginated results
  const paginatedItems = sortedItems.slice(skip, skip + parseInt(limit));

  // write page info
  const pageInfo = {
    currentItems: paginatedItems.length,
    totalItems: sortedItems.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(sortedItems.length / limit),
    limit: parseInt(limit),
    offset: parseInt(offset),
  };

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: sortedItems,
  });
});

// Create a attendance by Admin
router.post("/", adminAuthenticated, async function (req, res, next) {
  const { user_mobile, date, lunch, dinner } = req.body;
  if (!date || !user_mobile || (!lunch && !dinner)) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "Bad request",
      message: "Missing fields",
      data: null,
    });
    return;
  }

  const attendance = await CreateAttendanceByAdmin(req.body);

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
    message: "success",
    data: attendance,
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
