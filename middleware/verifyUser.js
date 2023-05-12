const User = require("../models/userModel");
const Project = require("../models/projectModel");
const mongoose = require("mongoose");

const verifyUser = async (req, res, next) => {
  console.log(`verifyuser middleware`);
  const projectExists = mongoose.isValidObjectId(req.params.project_id);
  if (!projectExists) {
    return res.status(401).json({ message: "Project does not exist" });
  }
  try {
    const token = req.cookies.jwt;
    const user = await User.findOne({ refreshToken: token }).lean().exec();
    // passing project object through middleware using res.locals
    let project = await Project.findOne({ _id: req.params.project_id })
      .lean()
      .exec();
    res.locals.project = project;
    const userExists = project.members.some((id) => id.equals(user._id));
    if (userExists) return next();
    res.status(404).json({ message: "You don't belong to this project" });
  } catch (error) {
    res.sendStatus(400);
  }
};

module.exports = verifyUser;
