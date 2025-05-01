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
  const { tournamentId } = req.body;  // Убираем категорию из параметров

  try {
    // Загружаем всех бойцов без фильтрации по категории
    const fighters = await Fighter.findAll({
      include: ['team']
    });

    if (fighters.length < 2) {
      return res.status(400).json({ message: 'Недостаточно бойцов для турнира' });
    }

    // Группируем бойцов по командам
    const teams = {};
    fighters.forEach(fighter => {
      if (!teams[fighter.teamId]) teams[fighter.teamId] = [];
      teams[fighter.teamId].push(fighter);
    });

    // Создаем массив бойцов, перетасованный по командам (по кругу)
    const ordered = [];
    let hasFighters = true;
    while (hasFighters) {
      hasFighters = false;
      for (const teamId in teams) {
        if (teams[teamId].length > 0) {
          ordered.push(teams[teamId].shift());
          hasFighters = true;
        }
      }
    }

    const matches = [];

    for (let i = 0; i < ordered.length - 1; i += 2) {
      const fighter1 = ordered[i];
      const fighter2 = ordered[i + 1];

      // Проверка, что бойцы не из одной команды
      if (fighter1.teamId === fighter2.teamId) {
        // Попробуем найти замену дальше
        let swapped = false;
        for (let j = i + 2; j < ordered.length; j++) {
          if (ordered[j].teamId !== fighter1.teamId) {
            // Меняем местами
            [ordered[i + 1], ordered[j]] = [ordered[j], ordered[i + 1]];
            swapped = true;
            break;
          }
        }

        if (!swapped) {
          console.log('Не удалось избежать пары из одной команды');
        }
      }

      matches.push({
        fighterId: ordered[i].id,
        opponentId: ordered[i + 1].id,
        tournamentId,
        date: new Date()
      });
    }

    // Сохраняем матчи
    await Match.bulkCreate(matches);

    res.json({ message: 'Турнирная сетка успешно создана', matches });
  } catch (error) {
    console.error('Ошибка при генерации сетки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

exports.generateTournamentMatches = generateTournamentBracket;
