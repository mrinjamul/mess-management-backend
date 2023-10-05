var express = require("express");
var router = express.Router();

// import http constants
var constants = require("../constants");
// import helpers
const bcrypt = require("../helpers/bcrypt");
// import jwt
const jwt = require("../helpers/jwt");
const { cookieConfig } = require("../helpers/cookie");
const { maskUser } = require("../helpers/utils");

// import Controllers
const { CreateUser, GetUserByMobile } = require("../controllers/users");

/* Auth API routes */

// SignUp route
router.post("/signup", async function (req, res, next) {
  const { mobile } = req.body;
  // check for required values;
  if (!mobile) {
    res.status(constants.http.StatusBadRequest).json({
      code: constants.http.StatusBadRequest,
      error: "Bad Request",
      message: "Mobile Number required",
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
    message: "User created successfully.",
    data: usr,
  });
});

// Login route
router.post("/login", async function (req, res, next) {
  // get login credentials
  const { mobile, password } = req.body;
  if (!mobile) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "Bad Request",
      message: "Mobile Number missing",
      data: null,
    });
    return;
  }

  // get user informations
  const user = await GetUserByMobile(mobile);
  if (!user) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "User not found",
      data: null,
    });
    return;
  }
  // get token

  var token;
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch (err) {
    // console.log("error: failed to get token from header");
  }
  if (token) {
    var verifyOpts = jwt.getVerifyingOptions();
    var decodedToken;
    try {
      decodedToken = jwt.verifyToken(token, verifyOpts);
    } catch (error) {
      console.log(error);
    }
    if (decodedToken) {
      const usr = maskUser(user);
      res.status(constants.http.StatusOK).json({
        status: true,
        message: "User already logged in",
        token: token,
        data: usr,
      });
      return;
    }
  }

  if (user.role == "user") {
    const usr = maskUser(user);
    var payload = jwt.getPayload(user);
    const subject = user.id;
    var signOpts = jwt.getSigningOptions(subject);
    // generate token
    const token = jwt.issueToken(payload, signOpts);

    res.status(constants.http.StatusOK).json({
      status: true,
      message: "Logged in successfully",
      token: token,
      data: usr,
    });
    return;
  } else {
    if (!password) {
      var usr = maskUser(user);
      // generate token as a user
      var payload = jwt.getPayload(user);
      payload.accessLevel = 1;
      payload.role = "user";
      usr.role = "user";
      usr.level = 1;
      const subject = user.id;
      var signOpts = jwt.getSigningOptions(subject);
      // generate token
      const token = jwt.issueToken(payload, signOpts);

      res.status(constants.http.StatusOK).json({
        status: true,
        message: "logged in successfully",
        token: token,
        data: usr,
      });
      return;
    }
    // validate user password
    const isVerified = await bcrypt.VerifyHash(password, user.password);
    if (isVerified) {
      const usr = maskUser(user);
      var payload = jwt.getPayload(user);
      const subject = user.id;
      var signOpts = jwt.getSigningOptions(subject);
      // generate token
      const token = jwt.issueToken(payload, signOpts);

      res.status(constants.http.StatusOK).json({
        status: true,
        message: "logged in successfully",
        token: token,
        data: usr,
      });
      return;
    } else {
      res.status(constants.http.StatusBadRequest).json({
        status: false,
        error: "invalid request",
        message: "Invalid password",
        data: null,
      });
      return;
    }
  }
});

// Logout route
router.get("/logout", function (req, res, next) {
  // get token
  var token;
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch (err) {
    // console.log("error: failed to get token from header");
  }
  if (!token) {
    res.status(constants.http.StatusOK).json({
      message: "User not logged in",
    });
    return;
  }
  // clear token cookie
  res.clearCookie("token");
  res.status(constants.http.StatusOK).json({
    message: "Logout successfully",
  });
});

module.exports = router;
