var express = require("express");
var router = express.Router();

constants = require("../../constants");

const { maskUser } = require("../../helpers/utils");

const {
  CreateUser,
  GetAllUser,
  GetUserByID,
  GetUserByMobile,
  UpdateUserByMobile,
  DeleteUserByMobile,
} = require("../../controllers/users");

const authenticated = require("../../middlewares/authenticated");
const adminAuthenticated = require("../../middlewares/adminAuthenticated");

/* V1 API routes */

// Get all users
router.get("/", authenticated, async function (req, res, next) {
  const users = await GetAllUser();

  if (!users) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "success",
      data: null,
    });
  }
  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: users,
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
      message: "mobile no fields",
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
      message: "user already exists",
      data: null,
    });
    return;
  }

  const usr = maskUser(user);

  res.status(constants.http.StatusCreated).json({
    status: true,
    message: "success",
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
      message: "failed to get user info",
      data: null,
    });
    return;
  }

  const user = await GetUserByMobile(mobile);
  if (!user) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "user doesn't exists",
      data: null,
    });
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
      message: "failed to get user info",
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
      message: "user doesn't exists",
      data: null,
    });
  }

  const usr = maskUser(user);

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: usr,
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
      message: "user doesn't exists",
      data: null,
    });
  }

  const usr = maskUser(user);

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: usr,
  });
});

module.exports = router;
