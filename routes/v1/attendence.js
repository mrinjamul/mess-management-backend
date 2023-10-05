var express = require("express");
var router = express.Router();

constants = require("../../constants");

const authenticated = require("../../middlewares/authenticated");

router.get("/", authenticated, async function (req, res, next) {});

module.exports = router;
