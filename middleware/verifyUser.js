const User = require("../models/userModel");
const Project = require("../models/projectModel");

const verifyUser = async (req, res, next) => {
  // to find whether user exists in project
  try {
    const token = req.cookies.jwt;
    const user = await User.findOne({ refreshToken: token }).lean().exec();
    const project = await Project.findById({ _id: req.params.project_id })
      .lean()
      .exec();
    // passing project object through middleware using res.locals
    res.locals.project = project;
    const userExists = project.members.some((id) => id.equals(user._id));
    if (userExists) return next();
    res.sendStatus(404);
  } catch (error) {
    res.sendStatus(400);
  }
};

module.exports = verifyUser;
