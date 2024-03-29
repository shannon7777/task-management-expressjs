const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// API Routes
// Getting all tasks
// router.get('/', getTasks);
router.get('/:id', getTasks);

// Creating a single task 
router.post('/', createTask);

// Editing a specific task and date
router.put('/:id', updateTask);

// Deleting a task
router.delete('/:id', deleteTask);

module.exports = router;