const mongoose = require("mongoose");

var { randomUUID } = require("crypto");

var validator = require("validator");

var timestampPlugin = require("./plugins/timestamp");

const bcrypt = require("../helpers/bcrypt");

const UserSchema = new mongoose.Schema({
  id: {
    type: "UUID",
    default: () => randomUUID(),
  },
  firstName: {
    type: String,
    require: false,
  },
  middleName: {
    type: String,
    require: false,
  },
  lastName: {
    type: String,
    require: false,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  year: {
    type: String,
  },
  advance: {
    type: Number,
  },
  role: {
    type: String,
  },
  level: {
    type: Number,
    require: true,
  },
});

UserSchema.plugin(timestampPlugin);

UserSchema.virtual("fullName").get(function () {
  if (!this.middleName) {
    return this.firstName + " " + this.lastName;
  }
  return this.firstName + " " + this.middleName + " " + this.lastName;
});

UserSchema.virtual("fullName").set(function (name) {
  let str = name.split(" ");
  if (str.length == 2) {
    this.firstName = str[0];
    this.lastName = str[1];
  } else if (str.length == 1) {
    this.firstName = str[0];
  } else {
    this.firstName = str[0];
    this.middleName = str[1];
    this.lastName = str[2];
  }
});

UserSchema.methods.getInitials = function () {
  return this.firstName[0] + this.lastName[0];
};

UserSchema.pre("save", async function (next) {
  // Do the pre save task

  if (this.password) {
    this.password = await bcrypt.HashAndSalt(this.password);
  }

  if (!this.advance) {
    this.advance = 0;
  }

  if (!this.level) {
    this.level = 1;
    this.role = "user";
  } else if (this.level > 2) {
    this.role = "admin";
  } else {
    this.role = "user";
  }

  // Call the next function in the pre-save chain
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
