const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Маршрут для регистрации
router.post('/register', registerUser);

// Маршрут для логина
router.post('/login', loginUser);

module.exports = router;
