var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const {
  CreateRoutine,
  GetRoutines,
  GetRoutineByDay,
  UpdateRoutineByID,
  DeleteRoutineByID,
} = require("../../controllers/routine");

/* V1 API routes */

// Get Routines
router.get("/", async function (req, res, next) {
  const routines = await GetRoutines();
  if (!routines) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "success",
      data: [],
    });
    return;
  }
  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    data: routines,
  });
});

// Create Routine
router.post("/", async function (req, res, next) {
  const routine = await CreateRoutine(req);

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    routine: routine,
  });
});
// Get Routine
router.get("/:day", async function (req, res, next) {
  const day = req.params.day;
  const menu = await GetRoutineByDay(day);
  if (!menu) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "menu not found",
      routine: null,
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    routine: menu,
  });
});
// Update Routine
router.put("/:id", async function (req, res, next) {
  const id = req.params.id;

  const { day, lunch, dinner } = req.body;

  const menu = await UpdateRoutineByID(id, req.body);

  if (!menu) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "menu not found",
      routine: null,
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    routine: menu,
  });
});
// Delete Routine
router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;

  const menu = await DeleteRoutineByID(id);

  if (!menu) {
    res.status(constants.http.StatusNotFound).json({
      status: false,
      error: "not found",
      message: "menu not found",
      routine: null,
    });
    return;
  }

  res.status(constants.http.StatusOK).json({
    status: true,
    message: "success",
    routine: menu,
  });
});

module.exports = router;
