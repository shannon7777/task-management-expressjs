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
  if (!item) return
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

const editProjectItem = async (req, res) => {
  const { item_id } = req.params;
  console.log(req.body);
  try {
    const updatedItem = await ProjectItem.findByIdAndUpdate(
      item_id,
      {
        $set: req.body,
      },
      { new: true }
    ).exec();
    res.status(200).json({
      message: `Updated project item to : ${updatedItem.item}`,
      updatedItem,
    });
  } catch (error) {
    res.status(400).json({ message: `Could not updated item` });
  }
};

const deleteProjectItem = async (req, res) => {
  console.log(req.params.item_id);
  try {
    const deletedItem = await ProjectItem.findByIdAndDelete(req.params.item_id);
    res
      .status(200)
      .json({ message: `Deleted project item: ${deletedItem.item}` });
  } catch (error) {
    res.status(400).json({ message: `Could not delete item` });
  }
};

const createNote = async (req, res) => {
  try {
    const createdNote = await ProjectItem.findByIdAndUpdate(
      req.params.item_id,
      {
        $push: {
          notes: req.body,
        },
      },
      { new: true }
    ).exec();
    // getting the last (created) noteObject of the notes array & send to client
    // const { length, [length-1]: newNote } = createdNote.notes;
    const newNote = [...createdNote.notes].pop();
    res.status(200).json({ message: `New note created`, newNote });
  } catch (error) {
    res.status(400).json({ message: `Could not add new note` });
  }
};

const removeNote = async (req, res) => {
  try {
    await ProjectItem.findByIdAndUpdate(req.params.item_id, {
      $pull: {
        notes: { _id: req.body.note_id },
      },
    });
    res.status(200).json({ message: `Deleted note` });
  } catch (error) {
    res.status(400).json({ message: `Could not delete note` });
  }
};

const getOwners = async (req, res) => {
  const { item_id } = req.params;
  try {
    const projectItem = await ProjectItem.findById(item_id).lean().exec();
    const owners = await User.find({ _id: projectItem.owners })
      .select(["-password", "-tasks", "-refreshToken", "-roles"])
      .lean()
      .exec();
    res.status(200).json({ owners });
  } catch (error) {
    res.sendStatus(400);
  }
};

const addOwners = async (req, res) => {
  const { item_id } = req.params;
  const ownersArr = req.body;
  const owners = await User.find({ email: ownersArr })
    .select(["-password", "-tasks", "-refreshToken", "-roles"])
    .lean()
    .exec();
  const ownerIds = owners.map(({ _id }) => _id);
  const ownerEmails = owners.map(({ email }) => email);

  try {
    await ProjectItem.findByIdAndUpdate(item_id, {
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
  const { item_id } = req.params;
  const owners = req.body;
  const users = await User.find({ email: owners }).lean().exec();
  const userIds = users.map(({ _id }) => _id);
  const userEmails = users.map(({ email }) => email);

  try {
    await ProjectItem.findByIdAndUpdate(item_id, {
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
  editProjectItem,
  deleteProjectItem,
  createNote,
  removeNote,
  addOwners,
  getOwners,
  removeOwners,
};
