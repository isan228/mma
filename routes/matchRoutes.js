const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Роуты для работы с матчами
router.post('/', matchController.createMatch);
router.get('/', matchController.getAllMatches);
router.get('/:id', matchController.getMatchById);
router.put('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deleteMatch);

module.exports = router;
