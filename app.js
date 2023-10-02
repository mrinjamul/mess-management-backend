var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const cors = require("cors");

var indexRouter = require("./routes/view");
var healthRouter = require("./routes/healthcheck");
var apiRouter = require("./routes/api");

var app = express();

// db client
const mongoose = require("mongoose");
// configs
const config = require("./config/config").getConfig();

// get Status object
var status = require("./helpers/status").getStatus();
status.startTime = new Date();

// make connection to the database
mongoose
  .connect(config.database.url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    dbName: "mess_mngnmt_system_db",
  })
  .then(() => {
    console.log("database is connected");
    const now = new Date();
    status.isDBConnected = true;
    status.bootTime = Math.abs(now - status.startTime);
  })
  .catch((err) => console.log(err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/health", healthRouter);
app.use("/api", apiRouter);

/* For frontend */
app.use("/", indexRouter);

// log all endpoints
function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(
      print.bind(null, path.concat(split(layer.route.path)))
    );
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach(
      print.bind(null, path.concat(split(layer.regexp)))
    );
  } else if (layer.method) {
    console.log(
      "%s /%s",
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join("/")
    );
  }
}

function split(thing) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

app._router.stack.forEach(print.bind(null, []));

module.exports = app;
