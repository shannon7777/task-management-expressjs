const express = require("express");
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require("../controllers/projectController");

// API ROUTES
// GETTING ALL PROJECTS
router.get("/:id", getProjects);

// Creating a Project
router.post("/", createProject);

// Edit project
router.put("/:id", updateProject);

// Delete Project
router.delete("/id", deleteProject);

module.exports = router;