const express = require('express');
const router = express.Router();
const { handleLogin, handleLogout, handleRefreshToken } = require('../controllers/authController');

// User Login Handler
router.post('/', handleLogin);

// Refresh Token Handler
router.get('/refresh', handleRefreshToken);

// User Logout Handler
router.get('/logout', handleLogout);

module.exports = router;