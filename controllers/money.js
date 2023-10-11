const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { CreateTransaction } = require("./transaction");
const { GetUserByMobile, UpdateUserByMobile } = require("./users");

// AddMoney: add money to the mess
const AddMoney = async (tnx) => {
  try {
    // const type = tnx.isSpend ? "out" : "in";
    const type = "in";
    const method = tnx.isCash ? "cash" : "due";
    var tx = {
      type: type,
      method: method,
      sender: tnx.sender,
      recipient: "admin",
      amount: tnx.amount,
      description: tnx.description,
    };

    if (!tnx.month) {
      tx.month = new Date().toLocaleString("en-US", { month: "long" });
    } else {
      tx.month = tnx.month;
    }

    const updatedTx = await CreateTransaction(tx);

    var user = {};

    if (method == "cash") {
      try {
        // get user info
        user = await GetUserByMobile(tnx.sender);
        // Add money to user's advance
        user = await UpdateUserByMobile(tnx.sender, {
          advance: user.advance + tnx.amount,
        });
      } catch (error) {
        console.log(error);
      }
    }

    return updatedTx;
  } catch (error) {
    console.log(error);
  }
};

// SpendMoney: spend money from the mess
const SpendMoney = async (tnx) => {
  try {
    const type = "out";
    const method = tnx.isCash ? "cash" : "due";
    var tx = {
      type: type,
      method: method,
      sender: "admin",
      recipient: tnx.recipient,
      amount: tnx.amount,
      // description: tnx.description,
      item: tnx.item,
      quantity: tnx.quantity,
    };
    if (tnx.description) {
      tx.description = tnx.description;
    }

    if (!tnx.month) {
      tx.month = new Date().toLocaleString("en-US", { month: "long" });
    } else {
      tx.month = tnx.month;
    }

    return await CreateTransaction(tx);
  } catch (error) {
    console.log(error);
  }
};

// CleanUpAdvance: reset advance in user fields
const CleanUpAdvance = async () => {
  try {
    // Update a users
    return await User.updateMany({}, { advance: 0 });
  } catch (error) {
    console.log(error);
  }
};

// CleanUpTnx: clean up transaction
const CleanUpTnx = async () => {
  try {
    return await Transaction.deleteMany({});
  } catch (error) {
    console.log(error);
  }
};

// GetAllSpends: return a outflow cash data
const GetAllSpends = async () => {
  try {
    return await Transaction.find({ type: "out" }).lean();
  } catch (error) {
    console.log(error);
  }
};

// Get Summary of money flows

const GetSummary = async (month) => {
  try {
    let matchStage = {}; // Match stage for aggregation pipeline

    // If month is provided, filter by that month
    if (month) {
      matchStage = { month: month };
    }

    // Calculate the total money spent (outflow)
    const outflowPipeline = [
      {
        $match: {
          ...matchStage, // Include month filter if provided
          type: "out", // Assuming "out" represents money spent, adjust if needed
        },
      },
      {
        $group: {
          _id: null,
          totalMoneySpent: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          totalMoneySpent: 1,
        },
      },
    ];

    // Calculate the total due to vendors (outflow in credit)
    const duePipeline = [
      {
        $match: {
          ...matchStage, // Include month filter if provided
          type: "out", // Assuming "out" represents money spent, adjust if needed
          method: "due", // for transaction in credit
        },
      },
      {
        $group: {
          _id: null,
          totalMoneyDue: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          totalMoneyDue: 1,
        },
      },
    ];

    // Calculate the total money received (inflow)
    const inflowPipeline = [
      {
        $match: {
          ...matchStage, // Include month filter if provided
          type: "in", // Assuming "in" represents money received, adjust if needed
        },
      },
      {
        $group: {
          _id: null,
          totalMoneyReceived: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          totalMoneyReceived: 1,
        },
      },
    ];

    const [outflowSummary, dueSummary, inflowSummary] = await Promise.all([
      Transaction.aggregate(outflowPipeline),
      Transaction.aggregate(duePipeline),
      Transaction.aggregate(inflowPipeline),
    ]);

    // Calculate the net money
    const netMoney =
      (inflowSummary[0]?.totalMoneyReceived || 0) -
      (outflowSummary[0]?.totalMoneySpent || 0);

    const summary = {
      month: month || "all", // Provide a default value if month is empty
      totalMoneySpent: outflowSummary[0]?.totalMoneySpent || 0,
      totalMoneyReceived: inflowSummary[0]?.totalMoneyReceived || 0,
      totalMoneyDue: dueSummary[0]?.totalMoneyDue || 0,
      netMoney: netMoney,
    };
    return summary;
  } catch (error) {
    // console.error("Error while fetching summary:", error);
    // throw error;
    console.log(error);
  }
};

module.exports = {
  AddMoney,
  SpendMoney,
  CleanUpAdvance,
  CleanUpTnx,
  GetAllSpends,
  GetSummary,
};
