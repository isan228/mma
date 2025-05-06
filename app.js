const cors = require('cors');
const express = require('express');

const path = require('path');
const fighterRoutes = require('./routes/fighterRoutes');
const matchRoutes = require('./routes/matchRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const db = require('./models');
const trainerRoutes = require('./routes/trainerRoutes');
const teamRoutes = require('./routes/teamRoutes');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/userRoutes');  // Роуты для регистрации и логина
const { verifyToken } = require('./middleware/auth');
const newsRoutes = require('./routes/newsRoutes');
const dotenv = require('dotenv');

const app = express();
const port = 3000;
dotenv.config();

// Синхронизация базы данных
db.sequelize.sync({ force: true }) // force: false, чтобы не удалять таблицы каждый раз
  .then(() => {
    console.log("База данных синхронизирована!");
  })
  .catch(err => {
    console.error('Ошибка при синхронизации базы данных:', err);
  });
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Статичные файлы
app.use(express.static(path.join(__dirname, 'public')));

// Подключение маршрутов
app.use('/api/fighters', fighterRoutes);
app.use('/api/matches', matchRoutes);  // Роуты для матчей
app.use('/api/tournaments', tournamentRoutes);  // Роуты для турниров
app.use('/api/trainer', trainerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/search', searchRoutes);
app.use('/news', newsRoutes);
app.use('/api/users', userRoutes); // Роуты для регистрации и логина


// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Страница турниров
app.get('/tournaments', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tournaments.html'));
});
app.get('/fighter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'fighter.html'));
});
app.get('/treners', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'treners.html'));
});


// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
