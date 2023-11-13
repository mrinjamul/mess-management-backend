var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const authenticated = require("../../middlewares/authenticated");
const adminAuthenticated = require("../../middlewares/adminAuthenticated");

const {
  AddMoney,
  SpendMoney,
  CleanUpAdvance,
  CleanUpTnx,
  GetAllSpends,
  GetSummary,
} = require("../../controllers/money");

const utils = require("../../helpers/utils");

// Add money to the mess
router.post("/add", adminAuthenticated, async (req, res, next) => {
  // get transaction details
  var tnx = req.body;
  const { isCash, sender, recipient, amount, desciption } = tnx;
  if (!sender) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Sender field is missing",
      data: {},
    });
    return;
  }
  if (!recipient) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Recipient field is missing",
      data: {},
    });
    return;
  }
  if (!amount) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Amount field is missing",
      data: {},
    });
    return;
  }

  // Create a transaction
  const tx = await AddMoney(tnx);

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "Money added successfully",
    data: tx,
  });
});

// Spend money from the mess
router.post("/spend", adminAuthenticated, async (req, res, next) => {
  // get transaction details
  var tnx = req.body;
  const { isCash, sender, recipient, amount, item, quantity } = tnx;
  if (!sender) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Sender field is missing",
      data: {},
    });
    return;
  }
  if (!recipient) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Recipient field is missing",
      data: {},
    });
    return;
  }
  if (!amount) {
    res.status(constants.http.StatusBadRequest).json({
      status: false,
      error: "bad request",
      message: "Amount field is missing",
      data: {},
    });
    return;
  }

  // Create a transaction
  const tx = await SpendMoney(tnx);

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "Money send to " + recipient + " successfully",
    data: tx,
  });
});

// Create summary
router.get("/summary", authenticated, async (req, res, next) => {
  // get queries
  const { month } = req.query;

  let filter = "";

  if (month == "all") {
    filter = undefined;
  } else if (month) {
    filter = month;
  } else {
    filter = new Date()
      .toLocaleString("en-US", { month: "long" })
      .toLowerCase();
  }

  const summary = await GetSummary(filter);

  if (!summary) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "failed to get summary",
      message: "Not Found",
      data: {},
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: summary,
  });
});

// Get all spends
router.get("/expenses", authenticated, async (req, res, next) => {
  // get queries
  // Parse query parameters with default values
  const {
    page = 1,
    limit = 10,
    offset = 0, // Default to offset of 0 if not specified
    dateStart,
    dateEnd,
    sortBy = "created_at",
    orderBy = "desc",
    ...filters
  } = req.query;

  const transactions = await GetAllSpends();

  // if transaction not found
  if (!transactions) {
    const pageInf = {
      currentItems: 0,
      totalItems: 0,
      currentPage: parseInt(page),
      totalPages: 1,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };

    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "failed to get transactions from database",
      message: "Not Found",
      pageInfo: pageInf,
      data: [],
    });
    return;
  }

  //  Apply filters dynamically
  const filteredItems = transactions.filter(
    utils.getFilter(filters, dateStart, dateEnd)
  );

  // Sort items based on sortBy and orderBy
  const sortedItems = filteredItems.sort(utils.getSorter(sortBy, orderBy));

  //  Calculate the skip value based on both page and offset
  const skip = (page - 1) * limit + parseInt(offset);
  // Slice the items to get the paginated results
  const paginatedItems = sortedItems.slice(skip, skip + parseInt(limit));

  // write page info
  const pageInfo = {
    currentItems: paginatedItems.length,
    totalItems: sortedItems.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(sortedItems.length / limit),
    limit: parseInt(limit),
    offset: parseInt(offset),
  };

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    pageInfo: pageInfo,
    data: sortedItems,
  });
});

// Use to clean up tx mess

// router.get("/cleanup", adminAuthenticated, async (req, res, next) => {
//   const users = await CleanUpAdvance();
//   if (!users) {
//     res.status(constants.http.StatusInternalServerError).json({
//       status: false,
//       error: "not found",
//       message: "Not Found",
//       data: null,
//     });
//     return;
//   }

//   const tnx = await CleanUpTnx();
//   if (!tnx) {
//     res.status(constants.http.StatusInternalServerError).json({
//       status: false,
//       error: "not found",
//       message: "Transaction Not Found",
//       data: null,
//     });
//     return;
//   }

//   res.status(constants.http.StatusOK).json({
//     status: true,
//     message: "success",
//     data: {
//       users: users,
//       transactions: tnx,
//     },
//   });
// });

module.exports = router;
