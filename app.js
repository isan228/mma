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
const sportRoutes = require('./routes/sportRoutes');

const weightCategoryRoutes = require('./routes/weightCategoryRoutes');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = 3001;

app.use(cors({
  origin: 'https://mma-3mwk.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204
}) );
// Синхронизация базы данных
db.sequelize.sync({ force: false }) // force: false, чтобы не удалять таблицы каждый раз
  .then(() => {
    console.log("База данных синхронизирована!");
  })
  .catch(err => {
    console.error('Ошибка при синхронизации базы данных:', err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Статичные файлы
app.use(express.static(path.join(__dirname, 'public')));

// Подключение маршрутов
app.use('/api/sports', sportRoutes);
app.use('/api/categories', weightCategoryRoutes);
app.use('/api/fighters', fighterRoutes);
app.use('/api/matches', matchRoutes);  // Роуты для матчей
app.use('/api/tournaments', tournamentRoutes);  // Роуты для турниров
app.use('/api/trainer', trainerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/search', searchRoutes);
app.use('/news', newsRoutes);
app.use('/api/users', userRoutes); // Роуты для регистрации и логина

app.use('/trainers', trainerRoutes);
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
app.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
