const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Маршруты для матчей
router.get('/', matchController.getAllMatches);
router.post('/', matchController.createMatch);
router.delete('/:id', matchController.deleteMatch);

module.exports = router;
