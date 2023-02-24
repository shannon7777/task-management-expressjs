const express = require("express");
const router = express.Router();
const {
  getProjectItems,
  createProjectItem,
  addOwners,
  getOwners,
  removeOwners
} = require("../controllers/projectItemsController");

//   GET ALL PROJECT ITEMS
router.get("/:project_id", getProjectItems);

// CREATE ITEM
router.post("/:project_id", createProjectItem);

// Get Owners from each project item
router.get("/owners/:projectItem_id", getOwners);

// Add owners
router.post("/owners/:projectItem_id", addOwners);

// Remove Owners
router.put("/owners/:projectItem_id", removeOwners);

module.exports = router;
