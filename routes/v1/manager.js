var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const authenticated = require("../../middlewares/authenticated");
const adminAuthenticated = require("../../middlewares/adminAuthenticated");

// import helpers
const utils = require("../../helpers/utils");

const bcrypt = require("../../helpers/bcrypt");

const {
  ChangeManger,
  GetCurrentManager,
  GetAllManager,
} = require("../../controllers/manager");
const { GetUserByMobile } = require("../../controllers/users");

// Get current manager
router.get("/get", authenticated, async (req, res, next) => {
  const manager = await GetCurrentManager();
  if (!manager) {
    res.status(constants.http.StatusInternalServerError).json({
      status: false,
      message: "something went wrong",
      data: null,
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: manager,
  });
});

// Change Manager
router.post("/change", adminAuthenticated, async (req, res, next) => {
  // get fields from req body
  const { currentManager, newManager, password } = req.body;

  // check for missing fields
  if (!currentManager || !newManager) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "missing required fields",
      data: {},
    });
    return;
  }

  // find current manager entry if exist return
  const currentManagerEntry = await GetCurrentManager();
  if (currentManagerEntry.manager.mobile == newManager) {
    res.status(constants.http.StatusOK).json({
      status: true,
      message: "You are already a manager",
      data: currentManagerEntry,
    });
    return;
  }

  // check for missing password
  if (!password) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Password is missing",
      data: {},
    });
    return;
  }

  // get user password
  const user = await GetUserByMobile(currentManager);
  if (!user) {
    res.status(constants.http.StatusInternalServerError).json({
      status: false,
      message: "something went wrong",
      data: null,
    });
    return;
  }

  // validate user password
  const isVerified = await bcrypt.VerifyHash(password, user.password);
  if (!isVerified) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "invalid request",
      message: "Invalid password",
      data: null,
    });
    return;
  }

  const manager = await ChangeManger(currentManager, newManager);
  if (!manager) {
    res.status(constants.http.StatusInternalServerError).json({
      status: false,
      message: "something went wrong",
      data: null,
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "Manager changed successfully",
    data: manager,
  });
});

// get manager history
router.get("/history", adminAuthenticated, async (req, res, next) => {
  const history = await GetAllManager();
  if (!history) {
    res.status(constants.http.StatusInternalServerError).json({
      status: false,
      message: "something went wrong",
      data: [],
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: history,
  });
});

module.exports = router;
