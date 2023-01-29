const Project = require("../models/projectModel");
const User = require("../models/userModel");

const getProjects = async (req, res) => {
  const projects = await Project.find({ creator: req.params.id }).lean().exec();
  const members = await User.find().lean().exec();
//   console.log(members);
  res.status(200).json({ projects, members });
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
  const { project_id, member_email } = req.params;
  const user = await User.findOne({ email: member_email }).lean().exec();

  if (!user)
    return res.status(401).json({ message: `${member_email} does not exist` });

  const memberDuplicate = await Project.findById(project_id)
    .where({ members: user._id })
    .lean()
    .exec();

  if (memberDuplicate)
    return res.status(201).json({
      message: `${member_email} is already a member of this project`,
    });

  try {
    await Project.findByIdAndUpdate(project_id, {
      $push: { members: member._id },
    });
    res
      .status(200)
      .json({
        message: `${member.username} has been added to the project`,
        user,
      });
  } catch (error) {
    res.status(400).json({ message: `Could not add member: ${error.message}` });
  }
};

// const getMembers = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id).lean().exec();
//     // const users = await User.find({ project._id })
//     res.status(200).json({ users })
//   } catch (error) {

//   }
// };

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
  createProject,
  updateProject,
  addMember,
  deleteProject,
};
