var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const authenticated = require("../../middlewares/authenticated");
const adminAuthenticated = require("../../middlewares/adminAuthenticated");

const utils = require("../../helpers/utils");

const {
  GenerateBill,
  GetAllBill,
  GetBillByID,
  DeleteBillByID,
} = require("../../controllers/bill");

// Get all bills for the system
router.get("/", adminAuthenticated, async (req, res, next) => {
  const bills = await GetAllBill;
  if (!bills) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "failed to get bills",
      message: "Not Found",
      data: {},
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: bills,
  });
});

// Get a bill (current month)
router.get("/get", authenticated, async (req, res, next) => {
  const { month, year } = req.query;

  const bill = await GenerateBill(month, year);
  if (!bill) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "failed to get the bill",
      message: "Not Found",
      data: {},
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: bill,
  });
});

// get bill by id
// Get all bills for the system
router.get("/:id", adminAuthenticated, async (req, res, next) => {
  const id = req.params.id;
  const bill = await GetBillByID(id);
  if (!bill) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "failed to get the bill",
      message: "Not Found",
      data: {},
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: bill,
  });
});

router.delete("/:id", adminAuthenticated, async (req, res, next) => {
  const id = req.params.id;
  const bill = await DeleteBillByID(id);
  if (!bill) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "failed to delete the bill",
      message: "Not Found",
      data: {},
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: bill,
  });
});

module.exports = router;
