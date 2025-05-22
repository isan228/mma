const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');

// GET /ranking?gender=...&weightCategoryId=...&sportId=...
router.get('/', rankingController.getRanking);

module.exports = router;
