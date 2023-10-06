const mongoose = require("mongoose");

const timestampPlugin = require("./plugins/timestamp");

const AttendanceSchema = new mongoose.Schema({
  user_mobile: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    require: true,
  },
  lunch: {
    type: Boolean,
  },
  dinner: {
    type: Boolean,
  },
});

AttendanceSchema.plugin(timestampPlugin);

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = Attendance;
