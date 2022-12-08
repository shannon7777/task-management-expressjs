const express = require('express');
const router = express.Router();
const verifyJwt = require('../middleware/verifyJwt');
const { createUser, getAllUsers, getUser, editUser, retypePassword } = require('../controllers/userController');
const { getImage, postImage, deleteImage, upload } = require('../controllers/imageController');

// Create / Register new User
router.post('/', createUser);

// Get All Users
router.get('/', getAllUsers);

// Get user + user's data
router.get('/:id', getUser);

// ---  Need access token for editing user info ---
router.use(verifyJwt);  

// Edit user info
router.put('/:id', editUser);

// Retyping password to edit password
router.post('/:id', retypePassword);

// Get image from s3 bucket and mongodb
router.get('/img/:id', getImage);

// Posting an image to s3 and mongodb
router.post('/img/:id', upload.single("image"), postImage);

// Deleting an image from mongodb and s3
router.put('/img/:id', deleteImage);

module.exports = router;