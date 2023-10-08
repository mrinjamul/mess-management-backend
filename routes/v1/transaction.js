var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const authenticated = require("../../middlewares/authenticated");
const adminAuthenticated = require("../../middlewares/adminAuthenticated");

const {
  CreateTransaction,
  GetAllTransaction,
  GetTransactionByID,
  DeleteTransactionByID,
} = require("../../controllers/transaction");

const utils = require("../../helpers/utils");

// Get all transactions
router.get("/", authenticated, async function (req, res, next) {
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

  const transactions = await GetAllTransaction();

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

// Create a transaction
// router.post("/", adminAuthenticated, async function (req, res, next) {
//   const {
//     type,
//     method,
//     sender,
//     recipient,
//     amount,
//     description,
//     item,
//     quantity,
//   } = req.body;

//   if (!type || !method || !sender || !recipient || !amount) {
//     res.status(constants.http.StatusBadRequest).json({
//       status: false,
//       error: "missing fields",
//       message: "Missing required data",
//       data: {},
//     });
//     return;
//   }

//   let t = {
//     type: type,
//     method: method,
//     sender: sender,
//     recipient: recipient,
//     amount: amount,
//   };

//   if (description) {
//     t.description = description;
//   }
//   if (item) {
//     t.item = item;
//   }
//   if (quantity) {
//     t.quantity = quantity;
//   }

//   const tnx = await CreateTransaction(t);
//   if (!tnx) {
//     res.status(constants.http.StatusNotFound).json({
//       status: false,
//       error: "not found",
//       message: "Transaction does not exists",
//       data: {},
//     });
//     return;
//   }

//   res.status(constants.http.StatusOK).json({
//     status: true,
//     message: "Transaction created successfully",
//     data: tnx,
//   });
// });

// Get a transaction
router.get("/:id", authenticated, async function (req, res, next) {
  const id = req.params.id;
  const tnx = await GetTransactionByID(id);
  if (!tnx) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "Transaction does not exists",
      data: {},
    });
    return;
  }
  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: tnx,
  });
});

// Update a transaction
router.put("/:id", adminAuthenticated, async function (req, res, next) {});

// Delete a transaction
router.delete("/:id", adminAuthenticated, async function (req, res, next) {
  // Get id from parameters
  const id = req.params.id;

  // delete from db
  const tx = await DeleteTransactionByID(id);

  if (!tx) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "Transaction doesn't exists",
      data: null,
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "Transaction deleted successfully",
    data: tx,
  });
});

module.exports = router;
