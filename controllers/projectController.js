const Project = require("../models/projectModel");
const User = require("../models/userModel");

const getProjects = async (req, res) => {
  // gets all projects that user_id has created and is involved in
  const projects = await Project.find({ members: req.params.user_id })
    .lean()
    .exec();
  res.status(200).json({ projects });
};

const getProject = async (req, res) => {
  try {
    const project = await Project.find({ _id: req.params.project_id })
      .lean()
      .exec();
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: `Could not fetch user's projects` });
  }
};

const createProject = async (req, res) => {
  const { title, description, completion_date, user_id, priority } = req.body;
  console.log(req.body);
  try {
    const newProject = await Project.create({
      title,
      description,
      completion_date,
      creator: user_id,
      priority,
      members: user_id,
    });
    res.status(200).json({
      message: `A new project has been created: ${newProject.title}`,
      newProject,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Could not create a new project, ${error.message}` });
  }
};

const updateProject = async (req, res) => {};

const addMember = async (req, res) => {
  const { project_id } = req.params;
  const membersArr = req.body;
  const users = await User.find({ email: membersArr }).lean().exec();
  if (users.length < 1)
    return res.status(403).json({
      message: `This user: ${[
        ...membersArr,
      ]} does not exist, please try another`,
    });

  // users.forEach(user => {return {user ? }})

  const userIds = users.map((user) => user._id);
  const userEmails = users.map((user) => user.email);

  try {
    await Project.findByIdAndUpdate(project_id, {
      $addToSet: { members: { $each: [...userIds] } },
    });

    res.status(200).json({
      message: `${[...userEmails]} ${
        userEmails.length > 1 ? "have" : "has"
      } been added to the project`,
      users,
    });
  } catch (error) {
    res.status(400).json({ message: `Could not add member: ${error.message}` });
  }
};

const getMembers = async (req, res) => {
  const { project_id } = req.params;
  try {
    const project = await Project.findById(project_id).lean().exec();
    const users = await User.find({ _id: project.members })
      .select(["-password", "-tasks", "-refreshToken", "-roles"])
      .lean()
      .exec();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: `Could not retrieve team members` });
  }
};

const removeMember = async (req, res) => {
  const { project_id } = req.params;
  const membersArr = req.body;
  const users = await User.find({ email: membersArr }).lean().exec();
  const userIds = users.map((user) => user._id);
  const userEmails = users.map((user) => user.email);

  try {
    await Project.findByIdAndUpdate(project_id, {
      $pull: { members: { $in: [...userIds] } },
    });
    res
      .status(200)
      .json({ message: `Removed ${[...userEmails]} from this project` });
  } catch (error) {
    res.status(400).json({ message: `Could not remove users` });
  }
};

const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: `Project: ${deletedProject.title} has been deleted` });
  } catch (error) {
    res.status(400).json({
      message: `Could not delete project: ${error.message}`,
    });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  addMember,
  getMembers,
  removeMember,
  deleteProject,
};
