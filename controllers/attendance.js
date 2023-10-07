const Attendance = require("../models/Attendance");

const CreateAttendance = async (user) => {
  try {
    // get user info
    const { mobile } = user;

    // get current time;
    const date = new Date();

    // get day
    const day = date.getDate().toString().padStart(2, "0");
    // get month
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    // get year
    const year = date.getFullYear().toString().slice(-2);

    // get hour
    const hour = ((date.getUTCHours() + parseFloat(+5.5)) % 24).toFixed(2);
    if (hour < 17 && hour > 5) {
      // create formated date
      const formattedDate = `${day}-${month}-${year}`;
      // check if entry already exists
      var attendance = await Attendance.findOne({
        user_mobile: mobile,
        date: formattedDate,
      });
      if (attendance) {
        return await Attendance.findOneAndUpdate(
          { user_mobile: mobile, date: formattedDate },
          { lunch: true, dinner: false },
          { new: true }
        );
      } else {
        // Create a new entry for lunch if the current hour is before 16:00
        // create attendance
        attendance = new Attendance({
          user_mobile: mobile,
          date: formattedDate,
          lunch: true,
          dinner: false,
        });
        return await attendance.save();
      }
    } else {
      // create formated date
      const formattedDate = `${day}-${month}-${year}`;
      // check if entry already exists
      var attendance = await Attendance.findOne({
        user_mobile: mobile,
        date: formattedDate,
      });
      if (attendance) {
        // Get the previous entry and set dinner to true
        return await Attendance.findOneAndUpdate(
          { user_mobile: mobile, date: formattedDate },
          { dinner: true },
          { new: true }
        );
      } else {
        // Create a new entry for lunch if the current hour is before 16:00
        // create attendance
        attendance = new Attendance({
          user_mobile: mobile,
          date: formattedDate,
          lunch: false,
          dinner: true,
        });
        return await attendance.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// GetAllAttendance: return all attendance
const GetAllAttendance = async () => {
  try {
    // get all attendance
    return await Attendance.find();
  } catch (error) {
    console.log(error);
  }
};

// GetAllAttendanceByDay: return attendances for a day.
// day in string
const GetAllAttendanceByDay = async (day) => {
  try {
    if (!day || day === "") {
      // get current time;
      const date = new Date();

      // get day
      const dayNum = date.getDate().toString().padStart(2, "0");
      // get month
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      // get year
      const year = date.getFullYear().toString().slice(-2);

      // create formated date
      day = `${dayNum}-${month}-${year}`;
    }

    // get attendances
    return await Attendance.find({ date: day });
  } catch (error) {
    console.log(error);
  }
};

// GetCurrentAttendanceByMobile: return current day attendance for a user
const GetCurrentAttendanceByMobile = async (mobile) => {
  try {
    // get current time;
    const date = new Date();

    // get day
    const day = date.getDate().toString().padStart(2, "0");
    // get month
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    // get year
    const year = date.getFullYear().toString().slice(-2);

    // create formated date
    const formattedDate = `${day}-${month}-${year}`;
    // get entry
    var attendance = await Attendance.findOne({
      user_mobile: mobile,
      date: formattedDate,
    });
    if (attendance) {
      return await Attendance.findOne({
        user_mobile: mobile,
        date: formattedDate,
      });
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

// Attendance entry from db
const DeleteAttendance = async (id) => {};

module.exports = {
  CreateAttendance,
  GetAllAttendance,
  GetAllAttendanceByDay,
  GetCurrentAttendanceByMobile,
  DeleteAttendance,
};
