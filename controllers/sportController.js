// controllers/sportController.js
const { Sport } = require('../models');

exports.getAllSports = async (req, res) => {
  try {
    const sports = await Sport.findAll();
    res.json(sports);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении видов спорта' });
  }
};

exports.createSport = async (req, res) => {
  try {
    const { name } = req.body;
    const sport = await Sport.create({ name });
    res.status(201).json(sport);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при создании вида спорта' });
  }
};
