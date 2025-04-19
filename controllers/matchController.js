const { Match } = require('../models');

const matchController = {
  // Получить все матчи
  getAllMatches: async (req, res) => {
    try {
      const matches = await Match.findAll();
      res.json(matches);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при получении матчей' });
    }
  },

  // Создать новый матч
  createMatch: async (req, res) => {
    try {
      const { fighterId, opponent_name, date, result, method, event_name } = req.body;

      const match = await Match.create({
        fighterId,
        opponent_name,
        date,
        result,
        method,
        event_name
      });

      res.status(201).json(match);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при создании матча' });
    }
  },

  // Удалить матч по ID
  deleteMatch: async (req, res) => {
    try {
      const match = await Match.findByPk(req.params.id);
      if (!match) {
        return res.status(404).json({ error: 'Матч не найден' });
      }
      await Match.destroy({ where: { id: req.params.id } });
      res.sendStatus(204); // Удаление прошло успешно, возвращаем 204
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при удалении матча' });
    }
  }
};

module.exports = matchController;
