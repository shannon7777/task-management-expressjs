const express = require('express');
const router = express.Router();
const { getTasks, createTask, toggleProgress, updateTask, deleteTask } = require('../controllers/taskController');

// API Routes
// Getting all tasks
router.get('/', getTasks);

// Creating a single task 
router.post('/', createTask);

// Toggling the progress
router.post('/:id', toggleProgress);

// Editing a specific task and date
router.put('/:id', updateTask);

// Deleting a task
router.delete('/:id', deleteTask);

module.exports = router;