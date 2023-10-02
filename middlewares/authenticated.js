const jwt = require("../helpers/jwt");
const constants = require("../constants");

const authenticated = (req, res, next) => {
  var token;
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch (err) {
    // console.log("error: failed to get token from header");
  }
  if (!token) {
    // get cookie
    token = req.cookies.token;
  }
  // if unable to get token
  if (!token) {
    res.status(constants.http.StatusUnauthorized).json({
      code: constants.http.StatusUnauthorized,
      error: "token not provided",
      message: "Unauthorized",
    });
  }

  var verifyOpts = jwt.getVerifyingOptions();
  const decodedToken = jwt.verifyToken(token, verifyOpts);
  // decodedToken is null
  if (!decodedToken) {
    res.status(constants.http.StatusUnauthorized).json({
      code: constants.http.StatusUnauthorized,
      error: "invalid token",
      message: "Unauthorized",
    });
  }
  if (decodedToken.role != "admin" || decodedToken.accessLevel < 3) {
    res.status(constants.http.StatusUnauthorized).json({
      code: constants.http.StatusUnauthorized,
      error: "admin required",
      message: "Unauthorized",
    });
  } else {
    // set payload to the request
    req.user = decodedToken;
    next();
  }
};

module.exports = authenticated;
