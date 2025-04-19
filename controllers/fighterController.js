const { Fighter, Match } = require('../models');

const fighterController = {
  getAllFighters: async (req, res) => {
    try {
      const fighters = await Fighter.findAll();
      res.json(fighters);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при получении бойцов' });
    }
  },

  createFighter: async (req, res) => {
    try {
      const { name, age, country, height, weight, category, style, photo_url } = req.body;
      const newFighter = await Fighter.create({ name, age, country, height, weight, category, style, photo_url });
      res.status(201).json(newFighter);
    } catch (err) {
      console.error(err);
      res.status(500).send('Ошибка при добавлении бойца');
    }
  },

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

  updateFighter: async (req, res) => {
    try {
      const { name, age, country, height, weight, category, style, photo_url } = req.body;
      const [updated] = await Fighter.update(
        { name, age, country, height, weight, category, style, photo_url },
        { where: { id: req.params.id } }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Боец не найден для обновления' });
      }

      const updatedFighter = await Fighter.findByPk(req.params.id);
      res.json(updatedFighter);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при обновлении бойца' });
    }
  },

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
