const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Маршруты новостей
router.post('/', newsController.createNews);           // Создать новость
router.get('/', newsController.getAllNews);            // Получить все новости
router.get('/:id', newsController.getNewsById);        // Получить одну новость
router.put('/:id', newsController.updateNews);         // Обновить новость
router.delete('/:id', newsController.deleteNews);      // Удалить новость

module.exports = router;
