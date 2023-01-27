const Project = require("../models/projectModel");

const getProjects = async (req, res) => {
  const projects = await Project.find({ creator: req.params.id }).lean().exec();
  res.status(200).json({ projects });
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
    });
    res
      .status(200)
      .json({ messagee: `A new project has been created`, newProject });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Could not create a new project, ${error.message}` });
  }
};

const updateProject = async (req, res) => {};

const deleteProject = async (req, res) => {};

module.exports = { getProjects, createProject, updateProject, deleteProject };
