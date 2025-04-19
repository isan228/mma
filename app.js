const express = require('express');
const path = require('path');
const fighterRoutes = require('./routes/fighterRoutes');
const matchRoutes = require('./routes/matchRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const db = require('./models');
const trainerRoutes = require('./routes/trainerRoutes');
const teamRoutes = require('./routes/teamRoutes');


const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Статичные файлы
app.use(express.static(path.join(__dirname, 'public')));


// Подключение маршрутов
app.use('/api/fighters', fighterRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api', trainerRoutes);
app.use('/api', teamRoutes);

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/tournaments', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tournaments.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
