const mongoose = require("mongoose");

const timestampPlugin = require("./plugins/timestamp");

const ManagerSchema = new mongoose.Schema({
  index: {
    type: Number,
  },
  status: {
    type: String,
    required: true,
    lowercase: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: {
    type: String,
    required: true,
    lowercase: true,
  },
  year: {
    type: String,
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

ManagerSchema.plugin(timestampPlugin);

const Manager = mongoose.model("Manager", ManagerSchema);

module.exports = Manager;
