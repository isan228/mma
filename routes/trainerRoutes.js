const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const upload = require('../middleware/upload'); // <-- обязательно добавляем это

// Получить всех тренеров
router.get('/', trainerController.getAllTrainers);

// Получить тренера по ID
router.get('/:id', trainerController.getTrainerById);

// Добавить тренера (с загрузкой фото)
router.post('/', upload.single('photo'), trainerController.addTrainer);

// Обновить тренера (с возможной заменой фото)
router.put('/:id', upload.single('photo'), trainerController.updateTrainer);

// Удалить тренера
router.delete('/:id', trainerController.deleteTrainer);

module.exports = router;
