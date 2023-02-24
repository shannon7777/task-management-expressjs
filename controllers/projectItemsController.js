const ProjectItem = require("../models/projectItemModel");
const User = require("../models/userModel");

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
  const { item, deadline } = req.body;
  try {
    const projectItem = await ProjectItem.create({
      item,
      deadline,
      project_id: req.params.project_id,
    });
    res.status(200).json({ message: `New item created`, projectItem });
  } catch (error) {
    res.status(400).json({ message: `Could not create item` });
  }
};

const getOwners = async (req, res) => {
  const { projectItem_id } = req.params;
  try {
    const projectItem = await ProjectItem.findById(projectItem_id)
      .lean()
      .exec();
    const owners = await User.find({ _id: projectItem.owners })
      .select(["-password", "-tasks", "-refreshToken", "-roles"])
      .lean()
      .exec();
    console.log(owners);
    res.status(200).json({ owners });
  } catch (error) {
    res.sendStatus(400);
  }
};

const addOwners = async (req, res) => {
  const { projectItem_id } = req.params;
  const ownersArr = req.body;
  const owners = await User.find({ email: ownersArr }).lean().exec();
  const ownerIds = owners.map(({ _id }) => _id);
  const ownerEmails = owners.map(({ email }) => email);

  try {
    await ProjectItem.findByIdAndUpdate(projectItem_id, {
      $addToSet: { owners: { $each: [...ownerIds] } },
    });
    res
      .status(200)
      .json({ message: `${[...ownerEmails]} has been added to task`, owners });
  } catch (error) {
    res.status(400).json({ message: `Could not add owner: ${error.message}` });
  }
};

const removeOwners = async (req, res) => {
  const { projectItem_id } = req.params;
  const owners = req.body;
  const users = await User.find({ email: owners }).lean().exec();
  const userIds = users.map(({ _id }) => _id);
  const userEmails = users.map(({ email }) => email);

  try {
    await ProjectItem.findByIdAndUpdate(projectItem_id, {
      $pull: { owners: { $in: [...userIds] } },
    });
    res
      .status(200)
      .json({ message: `Removed ${[...userEmails]} from this task` });
  } catch (error) {
    res.status(400).json({ message: `Could not remove user` });
  }
};

module.exports = {
  getProjectItems,
  createProjectItem,
  addOwners,
  getOwners,
  removeOwners,
};
