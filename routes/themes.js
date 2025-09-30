const express = require('express');
const router = express.Router();
const ThemesController = require('../controllers/ThemesController');
const authenticateToken = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorize');

// Create a new theme (thematique)
// router.get('/', authenticateToken, authorizeRoles('admin'), UsersController.getAll);

router.get('/', ThemesController.getAll);
router.post('/', authenticateToken,authorizeRoles('admin'), ThemesController.createTheme);
router.put('/:id', authenticateToken,authorizeRoles('admin'), ThemesController.updateTheme);
router.delete('/:id', authenticateToken,authorizeRoles('admin'), ThemesController.deleteTheme);

module.exports = router;
