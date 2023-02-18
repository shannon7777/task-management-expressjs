const express = require("express");
const router = express.Router();
const {
  getProjectItems,
  createProjectItem,
} = require("../controllers/projectItemsController");

//   GET ALL PROJECT ITEMS
router.get("/:project_id", getProjectItems);

// CREATE ITEM
router.post("/:project_id", createProjectItem);

module.exports = router;
