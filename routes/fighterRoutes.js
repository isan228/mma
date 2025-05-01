const express = require('express');
const router = express.Router();
const fighterController = require('../controllers/fighterController');
const upload = require('../middleware/upload'); // ✅ добавляем upload

// Маршруты для бойцов
router.get('/', fighterController.getAllFighters);
router.post('/', upload.single('photo'), fighterController.createFighter); // ✅ ставим upload
router.get('/:id', fighterController.getFighterById);
router.put('/:id', upload.single('photo'), fighterController.updateFighter); // ✅ ставим upload
router.delete('/:id', fighterController.deleteFighter);
router.get('/:id/matches', fighterController.getMatchesForFighter);

module.exports = router;
