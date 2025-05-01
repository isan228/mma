const { Op } = require('sequelize');
const { Fighter, Trainer, Team } = require('../models');

exports.search = async (req, res) => {
  try {
    const query = req.query.q || '';

    const fighters = await Fighter.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }  // Используем Op.iLike
      },
      include: [{ model: Team, as: 'team' }]  // Правильная ассоциация
    });

    const trainers = await Trainer.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }
      },
      include: [{ model: Team, as: 'team' }]  // Добавлена ассоциация
    });

    res.json({ fighters, trainers });
  } catch (error) {
    console.error('Ошибка при поиске:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.searchTeams = async (req, res) => {
  try {
    const query = req.query.q || '';  // Получаем строку запроса

    const teams = await Team.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }  // Используем Op.iLike для нечувствительного к регистру поиска
      }
    });

    res.json(teams);
  } catch (error) {
    console.error('Ошибка при поиске команд:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};