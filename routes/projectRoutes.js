const express = require("express");
const router = express.Router();
const { getProjects, createProject, updateProject, addMember, deleteProject } = require("../controllers/projectController");

// API ROUTES
// GETTING ALL PROJECTS
router.get("/:id", getProjects);

// Creating a Project
router.post("/", createProject);

// Adding a member to the Project
router.post("/:project_id/:member_email", addMember);

// Edit project
router.put("/:id", updateProject);

// Delete Project
router.delete("/:id", deleteProject);

module.exports = router;