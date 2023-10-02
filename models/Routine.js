const mongoose = require("mongoose");

var timestampPlugin = require("./plugins/timestamp");

const RoutineSchema = new mongoose.Schema({
  day: {
    type: String,
    require: true,
    lowercase: true,
    unique: true,
  },
  lunch: {
    type: String,
    require: true,
  },
  dinner: {
    type: String,
    require: true,
  },
});

RoutineSchema.plugin(timestampPlugin);

const Routine = mongoose.model("Routine", RoutineSchema);

module.exports = Routine;
