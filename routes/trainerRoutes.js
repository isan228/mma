const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

// Получить всех тренеров
router.get('/trainers', trainerController.getAllTrainers);

// Добавить тренера
router.post('/trainers', trainerController.addTrainer);

// Обновить тренера
router.put('/trainers/:id', trainerController.updateTrainer);

// Удалить тренера
router.delete('/trainers/:id', trainerController.deleteTrainer);

module.exports = router;
