const ProjectItem = require("../models/projectItemModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");

const getProjectItems = async (req, res) => {
  console.log(`fetchprojectitems fired`);
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

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      project_id: req.params.project_id,
    })
      .lean()
      .exec();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(400).json({ message: `Could not fetch project categories` });
  }
};

const createCategory = async (req, res) => {
  console.log(req.body);
  const { title } = req.body;
  if (!title) return;
  try {
    const newCategory = await Category.create({
      title,
      project_id: req.params.project_id,
    });
    res.status(200).json({ message: `Category: ${title} added`, newCategory });
  } catch (error) {
    res.status(400).json({ message: `Could not create category` });
  }
};

const updateCategory = async (req, res) => {
  console.log(req.body);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.category_id,
      req.body,
      { new: true }
    ).exec();
    res
      .status(200)
      .json({ message: `Updated category title`, updatedCategory });
  } catch (error) {
    res.status(400).json({ message: `Could not update category title` });
  }
};

const createProjectItem = async (req, res) => {
  console.log(req.body);
  const { item, deadline, category_id } = req.body;
  if (!item) return;
  try {
    const projectItem = await ProjectItem.create({
      item,
      deadline,
      project_id: req.params.project_id,
      category_id,
    });
    await Category.findByIdAndUpdate(category_id, {
      $push: {
        projectItem_ids: projectItem.id,
      },
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
  console.log(ownersArr);
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
  const owner = req.body;
  const user = await User.find({ email: owner }).lean().exec();
  const { _id: userId, email: userEmail } = user[0];

  try {
    await ProjectItem.findByIdAndUpdate(item_id, {
      $pull: { owners: { $in: userId } },
    });
    res
      .status(200)
      .json({ message: `Removed ${userEmail} from this task`, user });
  } catch (error) {
    res.status(400).json({ message: `Could not remove user` });
  }
};

module.exports = {
  getProjectItems,
  getCategories,
  createCategory,
  updateCategory,
  createProjectItem,
  editProjectItem,
  deleteProjectItem,
  createNote,
  removeNote,
  addOwners,
  getOwners,
  removeOwners,
};
