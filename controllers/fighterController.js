const { Fighter, Match } = require('../models');
const path = require('path');
const fs = require('fs');

const fighterController = {
  // Получение всех бойцов
  getAllFighters: async (req, res) => {
    try {
      const fighters = await Fighter.findAll();
      res.json(fighters);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при получении бойцов' });
    }
  },

  // Создание нового бойца
  createFighter: [
    upload.single('photo'),  // Обрабатываем одно изображение, ключ поля 'photo'
    async (req, res) => {
      try {
        const {
          name,
          birthYear, // Вместо age
          gender,    // Новый пол
          country,
          height,
          weight,
          category,
          style,
          wins = 0,
          losses = 0,
          team,
          trainer,
          isPaid = false
        } = req.body;

        // Проверка файла
        let photo_url = null;
        if (req.file) {
          photo_url = req.file.path;  // Используем URL изображения, полученный от Cloudinary
        }

        const newFighter = await Fighter.create({
          name,
          birthYear,
          gender,
          country,
          height,
          weight,
          category,
          style,
          photo_url,
          wins,
          losses,
          teamId: team,
          trainerId: trainer,
          isPaid: isPaid === true || isPaid === 'true'
        });

        res.status(201).json(newFighter);
      } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при добавлении бойца');
      }
    }
  ],

  // Получение бойца по ID
  getFighterById: async (req, res) => {
    try {
      const fighter = await Fighter.findByPk(req.params.id);
      if (!fighter) {
        return res.status(404).json({ error: 'Боец не найден' });
      }
      res.json(fighter);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при получении бойца' });
    }
  },

  // Обновление данных бойца
  updateFighter: [
    upload.single('photo'),  // Обрабатываем одно изображение при обновлении
    async (req, res) => {
      try {
        const {
          name,
          birthYear, // Вместо age
          gender,    // Новый пол
          country,
          height,
          weight,
          category,
          style,
          wins,
          losses,
          team,
          trainer,
          isPaid
        } = req.body;

        let updateData = {
          name,
          birthYear,
          gender,
          country,
          height,
          weight,
          category,
          style,
          wins,
          losses,
          teamId: team,
          trainerId: trainer,
          isPaid: isPaid === true || isPaid === 'true'
        };

        if (req.file) {
          updateData.photo_url = req.file.path;  // Используем URL изображения, полученный от Cloudinary
        }

        const [updated] = await Fighter.update(updateData, { where: { id: req.params.id } });

        if (!updated) {
          return res.status(404).json({ error: 'Боец не найден для обновления' });
        }

        const updatedFighter = await Fighter.findByPk(req.params.id);
        res.json(updatedFighter);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при обновлении бойца' });
      }
    }
  ],

  // Удаление бойца
  deleteFighter: async (req, res) => {
    try {
      const fighter = await Fighter.findByPk(req.params.id);
      if (!fighter) {
        return res.status(404).json({ error: 'Боец не найден' });
      }
      await Fighter.destroy({ where: { id: req.params.id } });
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при удалении бойца' });
    }
  },

  // Получение матчей для бойца
  getMatchesForFighter: async (req, res) => {
    try {
      const fighter = await Fighter.findByPk(req.params.id);
      const matches = await Match.findAll({ where: { fighterId: req.params.id } });
      res.json({ fighter, matches });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при получении матчей' });
    }
  }
};

module.exports = fighterController;
