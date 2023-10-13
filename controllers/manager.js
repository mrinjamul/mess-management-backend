const Manager = require("../models/Manager");

const { GetUserByMobile } = require("./users");

// return previous month
function getPreviousMonth() {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const today = new Date();
  const lastMonth =
    today.getMonth() === 0
      ? new Date(today.getFullYear() - 1, 11, 1)
      : new Date(today.getFullYear(), today.getMonth() - 1, 1);

  return months[lastMonth.getMonth()];
}

// Change current manager
const ChangeManger = async (currentManagerMob, newManagerMob) => {
  try {
    // get current Month
    const currentMonth = new Date()
      .toLocaleString("en-IN", { month: "long" })
      .toLowerCase();
    // get current year
    const currentYear = new Date().toLocaleString("en-IN", { year: "numeric" });

    // Get current Manager details
    const currentManager = await GetUserByMobile(currentManagerMob);
    if (!currentManager) {
      return;
    }
    // update user role and access level
    currentManager.role = "user";
    currentManager.level = 1;
    await currentManager.save();
    // Get new Manger details
    const newManager = await GetUserByMobile(newManagerMob);
    if (!newManager) {
      return;
    }
    // update new Manager role and access level
    newManager.role = "admin";
    newManager.level = 3;
    await newManager.save();

    const manager = new Manager({
      status: "active",
      month: currentMonth,
      year: currentYear,
      manager: newManager._id,
      assignedBy: currentManager._id,
    });
    await manager.save();

    const prevMonth = getPreviousMonth();

    // get old Manager details
    var oldManager = await Manager.findOne({
      manager: currentManager._id,
      month: prevMonth,
      year: currentYear,
      status: "active",
    });
    if (!oldManager) {
      oldManager = new Manager({
        status: "inactive",
        month: prevMonth,
        year: currentYear,
        manager: currentManager._id,
      });
      await oldManager.save();
    } else {
      if (oldManager.manager == currentManager._id) {
        return oldManager.populate({
          path: "manager",
          select: {
            id: 1,
            fullName: 1,
            year: 1,
            mobile: 1,
            advance: 1,
            due: 1,
            role: 1,
            level: 1,
            created_at: 1,
            updated_at: 1,
          },
        });
      }
      oldManager.status = "inactive";
      await oldManager.save();
    }

    return manager.populate({
      path: "manager",
      select: {
        id: 1,
        fullName: 1,
        year: 1,
        mobile: 1,
        advance: 1,
        due: 1,
        role: 1,
        level: 1,
        created_at: 1,
        updated_at: 1,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// get current Manager info
const GetCurrentManager = async () => {
  try {
    // get current Month
    const currentMonth = new Date()
      .toLocaleString("en-IN", { month: "long" })
      .toLowerCase();
    // get current year
    const currentYear = new Date().toLocaleString("en-IN", { year: "numeric" });

    return await Manager.findOne({
      month: currentMonth,
      year: currentYear,
      status: "active",
    })
      .populate({
        path: "manager",
        select: {
          id: 1,
          fullName: 1,
          year: 1,
          mobile: 1,
          advance: 1,
          due: 1,
          role: 1,
          level: 1,
          created_at: 1,
          updated_at: 1,
        },
      })
      .exec();
  } catch (error) {
    console.log(error);
  }
};

// GetAllManager: return a manager history
const GetAllManager = async () => {
  try {
    return await Manager.find()
      .populate({
        path: "manager",
        select: {
          id: 1,
          fullName: 1,
          year: 1,
          mobile: 1,
          advance: 1,
          due: 1,
          role: 1,
          level: 1,
          created_at: 1,
          updated_at: 1,
        },
      })
      .exec();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  ChangeManger,
  GetCurrentManager,
  GetAllManager,
};
