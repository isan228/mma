const { Match, Fighter, Tournament } = require('../models');

// Создание матча
exports.createMatch = async (req, res) => {
  try {
    const {
      fighterId,
      opponentId,
      tournamentId,
      date,
      result,
      method,
      event_name,
      description
    } = req.body;

    const fighter = await Fighter.findByPk(fighterId);
    const opponent = await Fighter.findByPk(opponentId);
    const tournament = await Tournament.findByPk(tournamentId);

    if (!fighter || !opponent || !tournament) {
      return res.status(400).json({ message: 'Некоторые данные неверны' });
    }

    const match = await Match.create({
      fighterId,
      opponentId,
      tournamentId,
      date,
      result: result || '',
      method: method || '',
      event_name: event_name?.trim() || 'Не указан',
      description: description?.trim() || 'Не указано',
    });

    res.status(201).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при создании матча' });
  }
};

exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      include: [
        {
          model: Fighter,
          as: 'Fighter', // Это alias для fighterId
        },
        {
          model: Fighter,
          as: 'Opponent', // Это alias для opponentId
        },
        {
          model: Tournament, // Если есть
        }
      ]
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

// Получение матча по ID
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id, {
      include: [
        { model: Fighter, as: 'Fighter', attributes: ['id', 'name'] },  // Используем правильный alias
        { model: Fighter, as: 'Opponent', attributes: ['id', 'name'] },  // И для opponent
        { model: Tournament, attributes: ['id', 'name'] },  // Турнир
      ],
    });

    if (!match) {
      return res.status(404).json({ message: 'Матч не найден' });
    }

    res.status(200).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении матча' });
  }
};
exports.updateMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Матч не найден' });
    }

    const {
      fighterId,
      opponentId,
      tournamentId,
      date,
      result,
      method,
      event_name,
      description
    } = req.body;

    await match.update({
      fighterId,
      opponentId,
      tournamentId,
      date,
      result: result || '',
      method: method || '',
      event_name: event_name?.trim() || 'Не указан',
      description: description?.trim() || 'Не указано',
    });

    res.status(200).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при обновлении матча' });
  }
};


// Удаление матча
exports.deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Матч не найден' });
    }
    await match.destroy();
    res.status(200).json({ message: 'Матч удален' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при удалении матча' });
  }
};
