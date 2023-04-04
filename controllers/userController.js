const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  // check for email duplicates in DB
  const duplicateEmail = await User.findOne({ email }).lean().exec();
  const duplicateUsername = await User.findOne({ username }).lean().exec();

  if (duplicateEmail) {
    return res.status(409).json({
      message: `This email : ${email} already exists, please try another email`,
    });
  }

  if (duplicateUsername) {
    return res.status(408).json({
      message: `This username : ${username} already exists, please try another email`,
    });
  }

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: hashedPwd,
    });
    res.status(200).json({
      message: `Registration successful, please proceed to sign in.`,
    });
  } catch (error) {
    if (!firstName || !lastName || !email || !username || !password) {
      res
        .status(403)
        .json({ message: `Please fill in the all the required fields` });
    } else {
      res
        .status(401)
        .json({ message: `Could not create a user, ${error.message}` });
    }
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(["-password", "-tasks", "-refreshToken", "-imgUrl"])
      .lean()
      .exec();
    if (!users) return res.status(401).json({ message: `Users not found` });
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (user) {
      res.status(200).json({ user });
    }
  } catch (error) {
    res.status(400).json({ message: `Could not find user, ${error.message}` });
  }
};

const editUser = async (req, res) => {
  const { password } = req.body;
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashed })
      .select(["-password", "-refreshToken"])
      .lean()
      .exec();
    return res.status(201).json({ message: `Password updated` });
  }
  try {
    const editedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
      .select(["-password", "-refreshToken"])
      .lean()
      .exec();
    res.status(200).json({
      message: `${editedUser.email}'s info successfully edited`,
      editedUser,
    });
  } catch (error) {
    res.status(401).json({ message: `Error: ${error.message}` });
  }
};

const retypePassword = async (req, res) => {
  console.log(req.body);
  const { retypePwd } = req.body;
  const user = await User.findById(req.params.id).lean().exec();
  const pwdMatch = await bcrypt.compare(retypePwd, user.password);
  if (pwdMatch) {
    res.status(200).json({ message: true });
  } else {
    res.status(400).json({ message: `Wrong password, try again` });
  }
};

module.exports = { createUser, getUser, getAllUsers, editUser, retypePassword };
