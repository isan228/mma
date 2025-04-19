const { Team } = require('../models');

exports.addTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Название обязательно' });
    }

    const newTeam = await Team.create({ name, description });
    res.status(201).json({ success: true, team: newTeam });
  } catch (error) {
    console.error('Ошибка при добавлении команды:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};
