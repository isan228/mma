const express = require('express');
const router = express.Router();
const fighterController = require('../controllers/fighterController');
const upload = require('../middleware/upload'); // ✅ добавляем upload

// Получение всех бойцов
router.get('/', fighterController.getAllFighters);

// Создание нового бойца
router.post('/', fighterController.createFighter);

// Получение бойца по ID
router.get('/:id', fighterController.getFighterById);

// Обновление бойца
router.put('/:id', fighterController.updateFighter);

// Удаление бойца
router.delete('/:id', fighterController.deleteFighter);

// Получение матчей для бойца
router.get('/:id/matches', fighterController.getMatchesForFighter);
module.exports = router;
