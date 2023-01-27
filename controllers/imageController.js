const multer = require("multer");
const crypto = require("crypto");
const {
  uploadFile,
  deleteFile,
  getObjectSignedUrl,
} = require("../config/s3aws");
const User = require("../models/userModel");

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// getting image from s3 bucket and image info from mongodb
const getImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().exec();
    const imageUrl = await getObjectSignedUrl(user.imgUrl);
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(401).json({ message: `Could not fetch user image` });
  }
};

// posting image to s3 bucket and storing info on mongodb
const postImage = async (req, res) => {
  console.log(req.file);
  const { mimetype, buffer } = req.file;
  try {
    const imageName = generateFileName();
    await uploadFile(imageName, buffer, mimetype);

    // Save imageName in mongodb
    const user = await User.findById(req.params.id).exec();
    user.imgUrl = imageName;
    await user.save();
    res.status(200).json({ message: `Image successfully uploaded` });
  } catch (error) {
    res.status(401).json({ message: `Could not upload image to server` });
  }
};

// deleting image from mongodb and s3
const deleteImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    await deleteFile(user.imgUrl);
    user.imgUrl = "";
    await user.save();
    res.status(200).json({ message: `Image removed` });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Could not delete picture, please try again` });
  }
};

module.exports = { getImage, postImage, deleteImage, upload };
