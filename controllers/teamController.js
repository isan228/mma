const { Team } = require('../models'); // Импорт модели Team

// Получить все команды
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Добавить команду
exports.addTeam = async (req, res) => {
  try {
    const { name } = req.body;
    let logo = null;

    if (req.file) {
      logo = req.file.filename; // Сохраняем ТОЛЬКО имя файла
    }

    const team = await Team.create({ name, logo });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Обновить команду
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let updateData = { name };

    if (req.file) {
      updateData.logo = req.file.filename; // Обновляем логотип, если пришёл новый файл
    }

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Команда не найдена' });
    }

    await team.update(updateData);

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Удалить команду
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Команда не найдена' });
    }

    await team.destroy();
    res.json({ message: 'Команда удалена' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить одну команду по ID
exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Команда не найдена' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
