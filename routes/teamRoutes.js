const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const upload = require('../middleware/upload'); // ЭТО ОК ✅

// GET всех команд
router.get('/', teamController.getTeams);

// POST новая команда
router.post('/', upload.single('logo'), teamController.addTeam);

// PUT обновить команду
router.put('/:id', upload.single('logo'), teamController.updateTeam);

// DELETE удалить команду
router.delete('/:id', teamController.deleteTeam);
// GET одна команда по id
router.get('/:id', teamController.getTeamById);



module.exports = router;
