const { Fighter, Match } = require('../models');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;  // Импортируем cloudinary
const upload = require('../middleware/upload');

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
        const { name, birthYear, gender, country, height, weight, category, weightCategoryId, sportId, wins = 0, losses = 0, team, trainer, isPaid = false } = req.body;
console.log('BODY:', req.body);
        // Проверка файла
        let photo_url = null;
        if (req.file) {
          // Загружаем фото в Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path);
          photo_url = result.secure_url;  // Сохраняем URL фото
        }

        const newFighter = await Fighter.create({
          name,
          birthYear,
          gender,
          country,
          height,
          weight,
           weightCategoryId,
         sportId,
          photo_url,
          wins,
          losses,
          teamId: team,
          trainerId: trainer,
          isPaid: isPaid === true || isPaid === 'true'
        });

        res.status(201).json(newFighter);
      } catch (err) {
        console.error('Ошибка при добавлении бойца:', err);
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
    upload.single('photo'),
    async (req, res) => {
      try {
        const {
          name,
          birthYear,
          gender,
          country,
          height,
      
          weightCategoryId,
          sportId,
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
                  weightCategoryId,
         sportId,
          wins,
          losses,
          teamId: team,
          trainerId: trainer,
          isPaid: isPaid === true || isPaid === 'true'
        };

        const fighter = await Fighter.findByPk(req.params.id);

        // Удаляем старое фото из Cloudinary, если оно есть
        if (fighter.photo_url && req.file) {
          const publicId = path.basename(fighter.photo_url, path.extname(fighter.photo_url));
          await cloudinary.uploader.destroy(publicId);  // Удаляем старую фотографию из Cloudinary
        }

        if (req.file) {
          // Загружаем новое фото в Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path);
          updateData.photo_url = result.secure_url;  // Обновляем URL фотографии
        }

        const [updated] = await Fighter.update(updateData, { where: { id: req.params.id } });

        if (!updated) {
          return res.status(404).json({ error: 'Боец не найден для обновления' });
        }

        const updatedFighter = await Fighter.findByPk(req.params.id);
        res.json(updatedFighter);
      } catch (err) {
        console.error('Ошибка при обновлении бойца:', err);
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

      // Удаляем фото из Cloudinary, если оно есть
      if (fighter.photo_url) {
        const publicId = fighter.photo_url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
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
