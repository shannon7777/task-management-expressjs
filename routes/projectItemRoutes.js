const express = require("express");
const router = express.Router();
const {
  getProjectItems,
  createProjectItem,
  editProjectItem,
  deleteProjectItem,
  createNote,
  addOwners,
  getOwners,
  removeOwners,
} = require("../controllers/projectItemsController");

//   GET ALL PROJECT ITEMS
router.get("/:project_id", getProjectItems);

// CREATE ITEM
router.post("/:project_id", createProjectItem);

// Edit Item
router.put("/:item_id", editProjectItem);

// Delete Item
router.delete("/:item_id", deleteProjectItem);

// Create Note
router.put("/notes/:item_id", createNote);

// Get Owners from each project item
router.get("/owners/:item_id", getOwners);

// Add owners
router.post("/owners/:item_id", addOwners);

// Remove Owners
router.put("/owners/:item_id", removeOwners);

module.exports = router;
