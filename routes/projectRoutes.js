const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  addMember,
  getMembers,
  removeMember,
  deleteProject,
} = require("../controllers/projectController");
const verifyUser = require("../middleware/verifyUser");

// API ROUTES
// GETTING ALL PROJECTS
router.get("/:user_id", getProjects);

// GET SINGLE PROJECT
router.get("/one/:project_id", verifyUser, getProject);

// Creating a Project
router.post("/", createProject);

// Adding a member to the Project
router.post("/members/:project_id", addMember);

// Retrieving team member/s from project
router.get("/members/:project_id", getMembers);

// Remove team member/s from project
router.put("/members/:project_id", removeMember);

// Edit project
router.put("/:id", updateProject);

// Delete Project
router.delete("/:id", deleteProject);

module.exports = router;
