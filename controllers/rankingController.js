const { Fighter, Match, WeightCategory, Sport } = require('../models');
const { Op } = require('sequelize');

exports.getRanking = async (req, res) => {
  try {
    let { gender, weightCategoryId, sportId } = req.query;

    if (!gender || !weightCategoryId || !sportId) {
      return res.status(400).json({ error: 'gender, weightCategoryId и sportId обязательны' });
    }

    // Маппинг пола с фронтенда на базу
    const genderMap = {
      male: 'Мужчина',
      female: 'Женщина',
    };

    gender = genderMap[gender.toLowerCase()];
    if (!gender) {
      return res.status(400).json({ error: 'Некорректное значение gender' });
    }

    weightCategoryId = parseInt(weightCategoryId);
    sportId = parseInt(sportId);

    // Получаем бойцов по фильтрам
    const fighters = await Fighter.findAll({
      where: {
        gender,
        weightCategoryId,
        sportId,
      },
      include: [
        { model: WeightCategory, as: 'weightCategory' },
        { model: Sport, as: 'sport' }
      ],
    });

    // Подсчёт боёв и побед каждого бойца
    const fightersWithStats = await Promise.all(fighters.map(async fighter => {
      const fighterId = fighter.id;

      // Подсчёт всех боёв (как в роли fighter, так и opponent)
      const totalFights = await Match.count({
        where: {
          [Op.or]: [
            { fighterId },
            { opponentId: fighterId }
          ]
        }
      });

      // Подсчёт побед бойца (когда он в роли fighter и выиграл)
      const wins = await Match.count({
        where: {
          fighterId,
          result: 'win'
        }
      });

      return {
        id: fighter.id,
        name: fighter.name,
        gender: fighter.gender,
        weightCategory: fighter.weightCategory.weight,
        sport: fighter.sport.name,
        wins,
        totalFights,
      };
    }));

    // Сортируем по количеству побед по убыванию
    fightersWithStats.sort((a, b) => b.wins - a.wins);

    console.log('Фильтр:', { gender, weightCategoryId, sportId });
    console.log('Найдено бойцов:', fighters.length);

    res.json(fightersWithStats);
  } catch (error) {
    console.error('Ошибка в getRanking:', error);
    res.status(500).json({ error: 'Ошибка при получении рейтинга' });
  }
};
