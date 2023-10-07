var express = require("express");
var router = express.Router();

constants = require("../../constants");

const bcrypt = require("../../helpers/bcrypt");

const { maskUser, getSorter } = require("../../helpers/utils");

const {
  CreateUser,
  GetAllUser,
  GetUserByID,
  GetUserByMobile,
  UpdateUserByMobile,
  ChangePasswordByMobile,
  DeleteUserByMobile,
} = require("../../controllers/users");

const { GetAllAttendanceByDay } = require("../../controllers/attendance");

const authenticated = require("../../middlewares/authenticated");
const adminAuthenticated = require("../../middlewares/adminAuthenticated");

/* V1 API routes */

// Get all users
router.get("/", authenticated, async function (req, res, next) {
  var users = await GetAllUser();

  if (!users) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "success",
      data: null,
    });
    return;
  }

  // get current day attendances
  const attendances = await GetAllAttendanceByDay();

  // Create a map to quickly look up attendances by user_mobile
  const attendanceMap = new Map();
  attendances.forEach((attendance) => {
    attendanceMap.set(attendance.user_mobile, attendance);
  });

  // get current time;
  const date = new Date();

  // Merge users with attendances and add the isEaten field
  users.forEach((user) => {
    const attendance = attendanceMap.get(user.mobile);

    if (attendance) {
      // If attendance record exists for the user, set isEaten based on lunch and dinner values
      // get hour
      const hour = ((date.getUTCHours() + parseFloat(+5.5)) % 24).toFixed(2);
      if (hour < 17 && hour > 5) {
        user.isEaten = attendance.lunch;
      } else {
        user.isEaten = attendance.dinner;
      }
      // user.isEaten = attendance.lunch || attendance.dinner;
    } else {
      // If no attendance record exists for the user, set isEaten to false
      user.isEaten = false;
    }
  });

  // Sort users by isEaten by asending order
  const sortedUsers = users.sort(getSorter("isEaten", "asc"));

  // send users in response
  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: sortedUsers,
  });
});

// Create a user
router.post("/", adminAuthenticated, async function (req, res, next) {
  const { fullName, year, advance, mobile, password } = req.body;
  // check for required values;
  if (!mobile) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "Bad Request",
      message: "Mobile Number required",
      data: null,
    });
    return;
  }

  // after validation, create user into the db
  const user = await CreateUser(req);
  // if err occurs then return with error
  if (!user) {
    res.status(constants.http.StatusInternalServerError).json({
      status: false,
      error: "something went wrong",
      message: "User already exists",
      data: null,
    });
    return;
  }

  const usr = maskUser(user);

  res.status(constants.http.StatusCreated).json({
    status: true,
    message: "User created successfully",
    data: usr,
  });
});

// get a user
router.get("/:mobile", authenticated, async (req, res, next) => {
  const mobile = req.params.mobile;

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

  const user = await GetUserByMobile(mobile);
  if (!user) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "User doesn't exists",
      data: null,
    });
    return;
  }

  if (userPayload.role !== "admin" && userPayload.mobile != user.mobile) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "permission denied",
      data: null,
    });
    return;
  }

  const usr = maskUser(user);

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: usr,
  });
});
// Update a user
router.put("/:mobile", authenticated, async (req, res, next) => {
  const mobile = req.params.mobile;

  const userEntry = await GetUserByMobile(mobile);

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
  if (userPayload.role !== "admin" && userPayload.mobile != userEntry.mobile) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "permission denied",
      data: null,
    });
    return;
  }

  const user = await UpdateUserByMobile(mobile, req.body);

  if (!user) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "User doesn't exists",
      data: null,
    });
    return;
  }

  const usr = maskUser(user);

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "User updated successfully",
    data: usr,
  });
});

// Change password
router.patch("/:mobile", authenticated, async (req, res, next) => {
  const mobile = req.params.mobile;
  // Get user informations
  const user = await GetUserByMobile(mobile);
  if (!user) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      message: "User does not exists",
      data: null,
    });
    return;
  }

  // if (user.role == "user") {
  //   res.status(constants.http.StatusOK).json({
  //     status: true,
  //     message: "Password is not required",
  //     data: null,
  //   });
  //   return;
  // }

  // get fields from request
  const { oldPassword, password } = req.body;

  if (user.password) {
    if (!oldPassword) {
      res.status(constants.http.StatusBadRequest).json({
        status: false,
        message: "old password is missing",
        data: null,
      });
      return;
    }
  }

  if (!password) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      message: "current password is missing",
      data: null,
    });
    return;
  }

  if (user.password) {
    const isMatched = await bcrypt.VerifyHash(oldPassword, user.password);
    if (!isMatched) {
      res.status(constants.http.StatusBadRequest).json({
        status: false,
        message: "Invalid Password",
        data: null,
      });
      return;
    }
  }

  const newHash = await bcrypt.HashAndSalt(password);

  const usr = await ChangePasswordByMobile(mobile, newHash);
  if (!usr) {
    res.status(constants.http.StatusInternalServerError).json({
      status: false,
      message: "Failed to update password",
      data: null,
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "Password updated successfully",
    data: null,
  });
});

// Delete a user
router.delete("/:mobile", adminAuthenticated, async (req, res, next) => {
  const mobile = req.params.mobile;

  const user = await DeleteUserByMobile(mobile);

  if (!user) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "User doesn't exists",
      data: null,
    });
    return;
  }

  const usr = maskUser(user);

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "User deleted successfully",
    data: usr,
  });
});

module.exports = router;
