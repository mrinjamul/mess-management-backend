var User = require("../models/User");

var bcrypt = require("../helpers/bcrypt");

// CreateUser: creates a user in db
const CreateUser = async (req) => {
  try {
    const { mobile, password, fullName, year, advance } = req.body;
    let user = new User({
      fullName: fullName,
      year: year,
      advance: advance,
      mobile: mobile,
      password: password,
    });
    return await user.save();
  } catch (err) {
    console.log(err);
  }
};

// GetAllUser: fetch all users from db
const GetAllUser = async (req) => {
  try {
    return await User.find();
  } catch (err) {
    console.log(err);
  }
};

// GetUserByID: fetch a user from db
const GetUserByID = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {
    console.log(err);
  }
};

// GetUserByMobile: fetch a user by mobile from db
const GetUserByMobile = async (mobile) => {
  try {
    return await User.findOne({ mobile: mobile });
  } catch (err) {
    console.log(err);
  }
};
// UpdateUserByID: update a user by id
const UpdateUserByID = async (id, user) => {
  try {
    const { fullName, year, advance } = user;
    const usr = {
      fullName: fullName,
      year: year,
      advance: advance,
    };
    return await User.findByIdAndUpdate(id, usr, {
      new: true,
    });
  } catch (err) {
    console.log(err);
  }
};

// UpdateUserByMobile: update a user by mobile
const UpdateUserByMobile = async (mobile, user) => {
  try {
    const { fullName, year, advance } = user;
    let firstName, middleName, lastName;
    let str = fullName.split(" ");
    if (str.length == 2) {
      firstName = str[0];
      lastName = str[1];
    } else if (str.length == 1) {
      firstName = str[0];
    } else {
      firstName = str[0];
      middleName = str[1];
      lastName = str[2];
    }
    let usr = {};

    if (firstName) {
      usr.firstName = firstName;
    }

    if (middleName) {
      usr.middleName = middleName;
    }

    if (lastName) {
      usr.lastName = lastName;
    }

    if (year) {
      usr.year = year;
    }

    if (advance) {
      usr.advance = advance;
    }

    return await User.findOneAndUpdate({ mobile: mobile }, usr, {
      new: true,
    });
  } catch (err) {
    console.log(err);
  }
};

// ChangePasswordByMobile: change a password for a user
const ChangePasswordByMobile = async (mobile, password) => {
  try {
    return await User.findOneAndUpdate(
      { mobile: mobile },
      { password: password },
      {
        new: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// DeleteUserByID: delete a user from db
const DeleteUserByID = async (id) => {
  try {
    return await User.findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
  }
};

// DeleteUserByMobile: delete a user from db
const DeleteUserByMobile = async (mobile) => {
  try {
    return await User.findOneAndRemove({ mobile: mobile });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  CreateUser,
  GetAllUser,
  GetUserByID,
  GetUserByMobile,
  UpdateUserByID,
  UpdateUserByMobile,
  ChangePasswordByMobile,
  DeleteUserByID,
  DeleteUserByMobile,
};
