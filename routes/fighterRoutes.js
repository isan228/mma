const express = require('express');
const router = express.Router();
const { Fighter, Match } = require('../models');
const fighterController = require('../controllers/fighterController');

// Маршруты для бойцов
router.get('/', fighterController.getAllFighters);
router.post('/', fighterController.createFighter);
router.get('/:id', fighterController.getFighterById);
router.put('/:id', fighterController.updateFighter);
router.delete('/:id', fighterController.deleteFighter);
router.get('/:id/matches', fighterController.getMatchesForFighter);

module.exports = router;