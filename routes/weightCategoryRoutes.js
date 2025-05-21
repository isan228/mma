const express = require('express');
const router = express.Router();
const weightCategoryController = require('../controllers/weightCategoryController');

// Добавление новой весовой категории (для админа)
router.post('/', weightCategoryController.createWeightCategory);

// Получение всех весовых категорий
router.get('/', weightCategoryController.getAllWeightCategories);

module.exports = router;
