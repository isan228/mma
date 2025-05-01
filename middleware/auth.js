// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Извлекаем токен из заголовка Authorization

  if (!token) {
    return res.status(401).json({ message: 'Токен не найден, доступ запрещен' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Сохраняем данные пользователя в запросе
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Неверный или истекший токен' });
  }
};

module.exports = { verifyToken };
