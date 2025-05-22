const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Маршрут для регистрации
router.post('/register', registerUser);

// Маршрут для логина
router.post('/login', loginUser);
router.get('/me', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: 'Adina' } });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    const { password_hash, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
