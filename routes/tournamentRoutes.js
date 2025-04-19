const express = require('express');
const { Tournament } = require('../models');
const router = express.Router();

// Получить все турниры
router.get('/', async (req, res) => {
    try {
      const tournaments = await Tournament.findAll({
        order: [['date', 'ASC']] // Сортировка по дате
      });
      res.json(tournaments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при получении турниров' });
    }
  });

// Создать новый турнир
router.post('/', async (req, res) => {
  try {
    const tournament = await Tournament.create(req.body);
    res.status(201).json(tournament);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при создании турнира' });
  }
});

// Удалить турнир
router.delete('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Турнир не найден' });
    }
    await tournament.destroy();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении турнира' });
  }
});

module.exports = router;