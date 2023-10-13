const Bill = require("../models/Bill");
const Attendance = require("../models/Attendance");

const { GetSummary } = require("./money");
const { GetAllTransactionByFilter } = require("./transaction");
const { GetAllUser } = require("./users");

// calculate if user attended for half month or full or none
const getUserAttendanceFactor = async (user_mobile, month, year) => {
  //FIXME: double check for any human errors
  // Get all the attendance records for the user in the provided month and year
  const attendanceRecords = await Attendance.find({
    user_mobile: user_mobile,
    date: { $regex: new RegExp(`^\\d{2}-${month}-${year}$`) }, // Match records for the provided month and year
  });

  // Define flags to track presence in 1-15 and after 15
  let attended1to15 = false;
  let attendedAfter15 = false;

  for (const record of attendanceRecords) {
    const day = parseInt(record.date.split("-")[0]);
    if (day >= 1 && day <= 15) {
      attended1to15 = true;
    } else if (day > 15) {
      attendedAfter15 = true;
    }
  }

  // Calculate the factor based on attendance pattern
  let factor = 0;
  if (attended1to15 && attendedAfter15) {
    factor = 2; // User attended both periods
  } else if (attended1to15 || attendedAfter15) {
    factor = 1; // User attended one of the periods
  }

  return factor;
};

// convert month string to number
function monthToNumber(monthString) {
  const monthMap = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  const normalizedMonth = monthString.trim().toLowerCase(); // Convert to lowercase and remove leading/trailing spaces

  // Check if the input month is a valid key in the monthMap
  if (normalizedMonth in monthMap) {
    return monthMap[normalizedMonth];
  }

  return null; // Return null for an invalid month
}

// get bills by month and year
const GetBillByTime = async (month, year) => {
  try {
    // if year not provided
    if (!year) {
      year = new Date().toLocaleString("en-US", { year: "numeric" });
    }
    // if month is not provided
    if (!month) {
      month = new Date()
        .toLocaleString("en-US", { month: "long" })
        .toLowerCase();
    }

    // Check if a bill entry already exists for the current month
    return await Bill.findOne({ month: month, year: year })
      .populate("transactions")
      .populate({
        path: "usersBill.user",
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

// return bill for current month;
const GenerateBill = async (month, year) => {
  try {
    let current = false;
    // if year not provided
    if (!year) {
      year = new Date().toLocaleString("en-US", { year: "numeric" });
      current = true;
    }
    // if month is not provided
    if (!month) {
      month = new Date()
        .toLocaleString("en-US", { month: "long" })
        .toLowerCase();
      current = true;
    }
    const summary = await GetSummary(month, year);
    if (!summary) {
      return;
    }

    const moneyReceived = summary.totalMoneyReceived;
    const moneySpent = summary.totalMoneySpent;
    const moneySpentOnCredit = summary.totalMoneyDue;
    const moneyAvailable = summary.netMoney;
    const totalMoneySpent = moneySpent + moneySpentOnCredit;
    const moneyRequired = totalMoneySpent - moneyAvailable;

    const tnxs = await GetAllTransactionByFilter(month, year);
    if (tnxs.length == 0) {
      return;
    }

    const transactions = tnxs.map((transaction) => transaction._id);

    let usersBill = [];

    let totalFactors = 0;

    let users = await GetAllUser();
    if (!users || users.length == 0) {
      return;
    }

    const monthNum = monthToNumber(month);

    for (let user of users) {
      const f = await getUserAttendanceFactor(
        user.mobile,
        monthNum,
        year.slice(-2)
      );
      totalFactors += parseInt(f);
      user.factor = parseInt(f);
    }

    const baseBill = parseInt(totalMoneySpent) / parseInt(totalFactors);

    for (const user of users) {
      const totalPayable = Math.ceil(baseBill * parseInt(user.factor));
      let moneyAdvance = parseInt(user.advance);
      let moneyDue = 0;

      if (totalPayable > moneyAdvance) {
        moneyDue = totalPayable - moneyAdvance;
      } else {
        moneyAdvance = moneyAdvance - totalPayable;
      }

      let duration = "none";

      if (user.factor == 2) {
        duration = "full";
      } else if (user.factor == 1) {
        duration = "half";
      }

      let userbill = {
        user: user._id,
        moneyAdvance: moneyAdvance,
        totalPayable: totalPayable,
        moneyDue: moneyDue,
        duration: duration,
      };
      usersBill = [...usersBill, userbill];
    }

    // console.log(totalFactors);

    const bill = {
      month: month,
      year: year,
      moneyReceived: moneyReceived,
      moneySpent: moneySpent,
      moneySpentOnCredit: moneySpentOnCredit,
      moneyAvailable: moneyAvailable,
      moneyRequired: moneyRequired,
      totalMoneySpent: totalMoneySpent,
      transactions: transactions,
      usersBill: usersBill,
    };

    let currentBill = await Bill.findOne({ month: month, year: year });
    if (!currentBill) {
      if (current) {
        currentBill = new Bill(bill);
        await currentBill.save();
        console.log(current);
      } else {
        return;
      }
    } else {
      if (current) {
        // Update currentBill properties with values from bill
        currentBill.month = bill.month;
        currentBill.year = bill.year;
        currentBill.moneyReceived = bill.moneyReceived;
        currentBill.moneySpent = bill.moneySpent;
        currentBill.moneySpentOnCredit = bill.moneySpentOnCredit;
        currentBill.moneyAvailable = bill.moneyAvailable;
        currentBill.moneyRequired = bill.moneyRequired;
        currentBill.totalMoneySpent = bill.totalMoneySpent;
        currentBill.transactions = bill.transactions;
        currentBill.usersBill = bill.usersBill;
        // Save it
        await currentBill.save();
      }
    }
    currentBill = await GetBillByTime(month, year);

    return currentBill;
  } catch (error) {
    console.log(error);
  }
};

// return all bills
const GetAllBill = async () => {
  try {
    return await Bill.find().lean();
  } catch (error) {
    console.log(error);
  }
};

// get bill by time
const GetBillByID = async (id) => {
  try {
    return await Bill.findById(id).lean();
  } catch (error) {
    console.log(error);
  }
};

// delete bill by id
const DeleteBillByID = async (id) => {
  try {
    return await Bill.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUserAttendanceFactor,
  GenerateBill,
  GetAllBill,
  GetBillByID,
  DeleteBillByID,
};
