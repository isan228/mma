// controllers/trainerController.js
const Trainer = require('../models/trainer'); // Это модель для тренера, если она существует.

// Получение списка тренеров
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    res.json(trainers);
  } catch (error) {
    res.status(500).send('Ошибка при получении тренеров');
  }
};

// Добавление нового тренера
exports.addTrainer = async (req, res) => {
  try {
    const { name, team, experience, photo_url } = req.body;
    const newTrainer = await Trainer.create({ name, team, experience, photo_url });
    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(500).send('Ошибка при добавлении тренера');
  }
};

// Редактирование тренера
exports.updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, team, experience, photo_url } = req.body;
    const trainer = await Trainer.findByPk(id);
    if (!trainer) {
      return res.status(404).send('Тренер не найден');
    }
    trainer.name = name;
    trainer.team = team;
    trainer.experience = experience;
    trainer.photo_url = photo_url;
    await trainer.save();
    res.json(trainer);
  } catch (error) {
    res.status(500).send('Ошибка при обновлении тренера');
  }
};

// Удаление тренера
exports.deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findByPk(id);
    if (!trainer) {
      return res.status(404).send('Тренер не найден');
    }
    await trainer.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Ошибка при удалении тренера');
  }
};
