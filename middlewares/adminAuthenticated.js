const jwt = require("../helpers/jwt");
const constants = require("../constants");

const adminAuthenticated = (req, res, next) => {
  var token;
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch (err) {
    // console.log("error: failed to get token from header");
  }
  // if unable to get token
  if (!token) {
    res.status(constants.http.StatusUnauthorized).json({
      code: constants.http.StatusUnauthorized,
      error: "token not provided",
      message: "Unauthorized",
      data: null,
    });
  }

  var verifyOpts = jwt.getVerifyingOptions();
  var decodedToken;
  try {
    decodedToken = jwt.verifyToken(token, verifyOpts);
  } catch (error) {
    console.log(error);
  }
  // decodedToken is null
  if (!decodedToken) {
    res.status(constants.http.StatusUnauthorized).json({
      code: constants.http.StatusUnauthorized,
      error: "invalid token",
      message: "Unauthorized",
      data: null,
    });
  }
  if (decodedToken.role != "admin" || decodedToken.accessLevel < 3) {
    res.status(constants.http.StatusUnauthorized).json({
      code: constants.http.StatusUnauthorized,
      error: "admin required",
      message: "Unauthorized",
      data: null,
    });
  } else {
    // set payload to the request
    req.user = decodedToken;
    next();
  }
};

module.exports = adminAuthenticated;
