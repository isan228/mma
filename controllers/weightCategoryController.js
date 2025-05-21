const { WeightCategory } = require('../models');

// Добавить новую весовую категорию
exports.createWeightCategory = async (req, res) => {
  try {
    const { weight } = req.body;

    if (!weight) {
      return res.status(400).json({ error: 'Поле weight обязательно' });
    }

    const existingCategory = await WeightCategory.findOne({ where: { weight } });
    if (existingCategory) {
      return res.status(400).json({ error: 'Такая категория уже существует' });
    }

    const newCategory = await WeightCategory.create({ weight });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Ошибка при добавлении категории:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получить все весовые категории
exports.getAllWeightCategories = async (req, res) => {
  try {
    const categories = await WeightCategory.findAll({ order: [['weight', 'ASC']] });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
