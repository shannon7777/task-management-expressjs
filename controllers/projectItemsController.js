const ProjectItem = require("../models/projectItemModel");

const getProjectItems = async (req, res) => {
  try {
    const projectItems = await ProjectItem.find({
      project_id: req.params.project_id,
    })
      .lean()
      .exec();
    res.status(200).json({ projectItems });
  } catch (error) {
    res.status(400).json({ message: `Could not fetch project items` });
  }
};

const createProjectItem = async (req, res) => {
  console.log(req.body);
  try {
    const projectItem = await ProjectItem.create({
      item: req.body.item,
      project_id: req.params.project_id,
    });
    res.status(200).json({ message: `New item created`, projectItem });
  } catch (error) {
    res.status(400).json({ message: `Could not create item` });
  }
};

module.exports = { getProjectItems, createProjectItem };
