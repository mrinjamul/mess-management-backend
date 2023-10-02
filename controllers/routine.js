const Routine = require("../models/Routine");

const CreateRoutine = async (req) => {
  try {
    const { day, lunch, dinner } = req.body;
    let routine = new Routine({
      day: day,
      lunch: lunch,
      dinner: dinner,
    });
    return await routine.save();
  } catch (err) {
    console.log(err);
  }
};

const GetRoutines = async (req) => {
  try {
    return await Routine.find();
  } catch (error) {
    console.log(error);
  }
};

const GetRoutineByDay = async (day) => {
  try {
    return await Routine.findOne({ day: day.toLowerCase() });
  } catch (err) {
    console.log(err);
  }
};

const UpdateRoutineByID = async (id, routine) => {
  try {
    const { day, lunch, dinner } = routine;
    let r = {
      // day: day,
      lunch: lunch,
      dinner: dinner,
    };
    return await Routine.findByIdAndUpdate(id, r, {
      new: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const UpdateRoutineByDay = async (day, routine) => {
  try {
    console.log("not implemented");
  } catch (error) {
    console.log(error);
  }
};

const DeleteRoutineByID = async (id) => {
  try {
    return await Routine.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  CreateRoutine,
  GetRoutines,
  GetRoutineByDay,
  UpdateRoutineByID,
  //   UpdateRoutineByDay,
  DeleteRoutineByID,
};
