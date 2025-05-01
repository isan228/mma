const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { Weight, Fighter } = require('../models'); // если используешь модели напрямую

// Основные маршруты
router.post('/', tournamentController.createTournament);
router.get('/', tournamentController.getAllTournaments);
router.get('/:id', tournamentController.getTournamentById);
router.put('/:id', tournamentController.updateTournament);
router.delete('/:id', tournamentController.deleteTournament);

// Получение бойцов турнира
router.get('/:id/fighters', tournamentController.getFightersByTournament);

// Получение весовых категорий турнира
router.get('/:id/weights', async (req, res) => {
  try {
    const weights = await Weight.findAll({ where: { tournamentId: req.params.id } });
    res.json(weights.map(w => w.name));
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при загрузке весовых категорий' });
  }
});

// Генерация турнирной сетки
router.post('/:id/generate', tournamentController.generateTournamentMatches);

module.exports = router;
