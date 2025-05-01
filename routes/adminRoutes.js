const express = require('express');
const adminController = require('../controllers/adminController');
const actionLogController = require('../controllers/actionLogController');
const authMiddleware = require('../middleware/authenticateJWT');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Роуты для администраторов
router.post('/create', authMiddleware, adminMiddleware, adminController.createAdmin);
router.put('/update/:id', authMiddleware, adminMiddleware, adminController.updateAdmin);
router.delete('/delete/:id', authMiddleware, adminMiddleware, adminController.deleteAdmin);

// Роут для получения всех журналов действий
router.get('/action-logs', authMiddleware, adminMiddleware, actionLogController.getActionLogs);

module.exports = router;
