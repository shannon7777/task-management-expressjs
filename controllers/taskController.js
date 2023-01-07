const Task = require("../models/taskModel");
const User = require("../models/userModel");

// retreiving all tasks that belong to the user that is logged in
const getTasks = async (req, res) => {
  // retrieving the refresh token from cookies in the browser
  const token = req.cookies.jwt;
  console.log(token);
  if (!token) return res.sendStatus(404);
  const user = await User.findOne({ refreshToken: token }).lean().exec();
  const tasks = await Task.find({ user_id: user._id }).lean().exec();

  try {
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch tasks.." });
  }
};

// creating a task that belongs to user
const createTask = async (req, res) => {
  const { text, description, dateToComplete, progress, user_id } = req.body;
  console.log("request body:", req.body);
  try {
    const newTask = await Task.create({
      text,
      description,
      dateToComplete,
      progress,
      user_id,
    });
    console.log("New task created:", newTask);
    // update user's tasks' field to include the newly created task id
    await User.findByIdAndUpdate(user_id, {
      $push: { tasks: newTask.id },
    });
    res.status(200).json({ message: `A new task has been added`, newTask });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Could not add new task, ${error.message}` });
  }
};

// toggling progress
// const toggleProgress = async (req, res) => {
//   const task = await Task.findById(req.params.id);
//   try {
//     if (task) {
//       task = !task.progress;
//       task.save();
//       res.status(200).json({
//         message: `Progress of task id: ${task.id} has been set to ${task.status}`,
//         task,
//       });
//     }
//   } catch (error) {
//     res.status(401).json({
//       message: `Could not toggle progress of id: ${req.params.id}, ${error.message}`,
//     });
//   }
// };

// updating task or date
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id).exec();
  console.log(req.body);
  try {
    const { text, description, dateToComplete, progress } = req.body;
    task.text = text ? text : task.text;
    task.description = description ? description : task.description;
    task.dateToComplete = dateToComplete ? dateToComplete : task.dateToComplete;
    task.progress = progress ? progress : task.progress;

    let completedDateToString = new Date().toDateString();
    task.completedDate = progress === "Completed" ? completedDateToString : "";

    message = {
      Completed: "Task Completed!",
      "In progress": "Task status changed to : In progress",
      Stuck: "Task status changed to: Stuck ",
      "New Task": "Task status changed to: New Task",
    };

    const updatedTask = await task.save();

    res.status(200).json({
      // message:
      //   progress === "Completed" ? `Task completed!` : `Task has been edited`,
      message: progress ? message[progress] : `Task has been edited`,
      updatedTask,
    });
  } catch (error) {
    res.status(401).json({
      message: `Could not update task: ${task.text}`,
    });
  }
};

// deleting a task
const deleteTask = async (req, res) => {
  // console.log(req.params.id);
  // Delete task id from the USER model before deleting task from the Task collection
  try {
    const user = await User.findOne({ tasks: req.params.id }).lean().exec();
    await User.updateOne(user, { $pull: { tasks: req.params.id } });
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: `Successfully deleted task of id: ${req.params.id}`,
      deletedTask,
    });
  } catch (error) {
    res.status(401).json({
      message: `Could not delete task of id: ${req.params.id}, ${error.message}`,
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
