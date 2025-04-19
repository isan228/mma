const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/teams', teamController.addTeam); // POST /api/teams

module.exports = router;
