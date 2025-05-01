const { News } = require('../models');

// Добавить новость
exports.createNews = async (req, res) => {
  try {
    const { title, content } = req.body;

    const news = await News.create({
      title,
      content,
      publishedAt: new Date(),
    });

    res.status(201).json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при создании новости' });
  }
};

// Получить все новости
exports.getAllNews = async (req, res) => {
  try {
    const newsList = await News.findAll({ order: [['publishedAt', 'DESC']] });
    res.json(newsList);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении новостей' });
  }
};

// Получить одну новость
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'Новость не найдена' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении новости' });
  }
};

// Обновить новость
exports.updateNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'Новость не найдена' });

    news.title = title;
    news.content = content;
    news.updatedAt = new Date();
    await news.save();

    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении новости' });
  }
};

// Удалить новость
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'Новость не найдена' });

    await news.destroy();
    res.json({ message: 'Новость удалена' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении новости' });
  }
};
