const Task = require("../models/taskModel");
const User = require("../models/userModel");

// retreiving all tasks that belong to the user that is logged in
const getTasks = async (req, res) => {
  // retrieving the refresh token from cookies in the browser
  const token = req.cookies.jwt;
  if (!token) return res.sendStatus(404);

  try {
    // there are 3 ways to query tasks belonging to a specific user
    // 1) Find User through unique reresh token and querying User's embedded taskIds
    // 2) matching user_id in task document with user logged in
    // 3) Or matching Task.user_id to req.params.id (user id) 
    // const user = await User.findOne({ refreshToken: token }).lean().exec();
    // const tasks = await Task.find({ user_id: user._id }).lean().exec();
    // const tasks = await Task.find({ _id: user.tasks }).lean().exec();
    // const user = await User.findOne({_id: req.params.id});
    // const tasks = await Task.find({ _id: user.tasks }).lean().exec();
    const tasks = await Task.find({ user_id: req.params.id }).lean().exec();
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

// updating task or date
const updateTask = async (req, res) => {
  const { text, description, dateToComplete, progress } = req.body;
  console.log(req.body);
  const notification = `Task status changed to: ${progress}`;
  message = {
    Completed: notification,
    "In progress": notification,
    Stuck: notification,
    "New Task": notification,
  };

  try {
    // const task = await Task.findById(req.params.id);
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
      }
    ).exec();

    // task.text = text ? text : task.text;
    // task.description = description ? description : task.description;
    // task.dateToComplete = dateToComplete ? dateToComplete : task.dateToComplete;
    // task.progress = progress ? progress : task.progress;

    // let completedDateToString = new Date().toDateString();
    // task.completedDate = progress === "Completed" ? completedDateToString : "";
    // const updatedTask = await task.save();

    res.status(200).json({
      message: progress ? message[progress] : `Task has been edited`,
      updatedTask,
    });
  } catch (error) {
    res.status(401).json({
      message: `Could not update task: ${text}`,
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
