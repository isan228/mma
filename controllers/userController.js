const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Регистрация пользователя
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Проверяем, существует ли уже пользователь с таким именем
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    }

    // Хэшируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // Создаем нового пользователя
    const newUser = await User.create({
      username,
      password_hash: passwordHash,
      role: 'user', // Можно добавить поддержку ролей
    });

    res.status(201).json({ message: 'Пользователь зарегистрирован успешно' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log('Received data:', req.body); // Добавляем логирование данных
// Исходный пароль
const password1 = 'password123';

// Хэшируем пароль
bcrypt.hash(password1, 10, (err, hashedPassword) => {
  if (err) {
    console.log('Ошибка хэширования:', err);
  } else {
    console.log('Хэшированный пароль:', hashedPassword);
  }
});
  try {
    // Находим пользователя по имени
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('Пользователь не найден');
      return res.status(400).json({ message: 'Неверное имя пользователя или пароль' });
    }

    // Сравниваем введенный пароль с хэшированным паролем
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      console.log('Неверный пароль');
      return res.status(400).json({ message: 'Неверное имя пользователя или пароль' });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Ошибка при логине:', error);
    res.status(500).json({ message: 'Ошибка при логине' });
  }
};

module.exports = { registerUser, loginUser };
