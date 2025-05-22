const { Tournament, Fighter, Team, Match } = require('../models');

// Создание турнира
exports.createTournament = async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const tournament = await Tournament.create({ name, description, date, location });
    res.status(201).json(tournament);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при создании турнира' });
  }
};

// Получение всех турниров
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.findAll();
    res.status(200).json(tournaments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении турниров' });
  }
};
exports.getFightersByTournament = async (req, res) => {
  try {
    const fighters = await Fighter.findAll({
      include: [{ model: Team, as: 'team' }]
    });

    res.status(200).json(fighters);
  } catch (err) {
    console.error('Ошибка при загрузке бойцов:', err);
    res.status(500).json({ message: 'Ошибка при загрузке бойцов' });
  }
};
// Получение турнира по ID
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Турнир не найден' });
    }
    res.status(200).json(tournament);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении турнира' });
  }
};

// Обновление турнира
exports.updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Турнир не найден' });
    }

    const { name, description, date, location } = req.body;
    await tournament.update({ name, description, date, location });
    res.status(200).json(tournament);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при обновлении турнира' });
  }
};

// Удаление турнира
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Турнир не найден' });
    }
    await tournament.destroy();
    res.status(200).json({ message: 'Турнир удален' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при удалении турнира' });
  }
};
async function generateTournamentBracket(req, res) {
  const { tournamentId } = req.body;

  try {
    const fighters = await Fighter.findAll({
      include: ['team']
    });

    if (fighters.length < 2) {
      return res.status(400).json({ message: 'Недостаточно бойцов для турнира' });
    }

    const shuffled = [...fighters].sort(() => 0.5 - Math.random());
    const matches = [];

    while (shuffled.length >= 2) {
      let found = false;

      for (let i = 1; i < shuffled.length; i++) {
        if (shuffled[0].teamId !== shuffled[i].teamId) {
          matches.push({
            fighterId: shuffled[0].id,
            opponentId: shuffled[i].id,
            tournamentId,
            date: new Date()
          });
          shuffled.splice(i, 1);
          shuffled.splice(0, 1);
          found = true;
          break;
        }
      }

      if (!found) {
        matches.push({
          fighterId: shuffled[0].id,
          opponentId: shuffled[1].id,
          tournamentId,
          date: new Date()
        });
        shuffled.splice(0, 2);
      }
    }

    if (shuffled.length === 1) {
      matches.push({
        fighterId: shuffled[0].id,
        opponentId: null,
        tournamentId,
        date: new Date()
      });
    }

    await Match.bulkCreate(matches);

    res.json({ message: 'Турнирная сетка успешно создана', matches });
  } catch (error) {
    console.error('Ошибка при генерации сетки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

exports.generateTournamentMatches = generateTournamentBracket;
