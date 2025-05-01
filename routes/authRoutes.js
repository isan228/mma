const express = require('express');
const authController = require('../controllers/userController');
const router = express.Router();

// Логин
router.post('/login', authController.login);

module.exports = router;
