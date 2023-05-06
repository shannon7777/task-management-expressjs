const express = require("express");
const router = express.Router();
const {
  getProjectItems,
  getCategories,
  createCategory,
  updateCategory,
  createProjectItem,
  editProjectItem,
  deleteProjectItem,
  createNote,
  removeNote,
  addOwners,
  getOwners,
  removeOwners,
} = require("../controllers/projectItemsController");

// Fetch all project items
router.get("/:project_id", getProjectItems);

// Fetch Project Categories
router.get("/category/:project_id", getCategories);

// Create category
router.post("/category/:project_id", createCategory);

// Edit Category
router.put("/category/:category_id", updateCategory)

// CREATE ITEM
router.post("/:project_id", createProjectItem);

// Edit Item
router.put("/:item_id", editProjectItem);

// Delete Item
router.delete("/:item_id", deleteProjectItem);

// Create Note
router.put("/notes/:item_id", createNote);

// Remove specific Note from notes
router.put("/removeNote/:item_id", removeNote);

// Get Owners from each project item
router.get("/owners/:item_id", getOwners);

// Add owners
router.post("/owners/:item_id", addOwners);

// Remove Owners
router.put("/owners/:item_id", removeOwners);

module.exports = router;
