const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const authenticateToken = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorize');

router.get('/dashboard', authenticateToken, authorizeRoles('user') ,UsersController.renderDashboard);

// Submit answer
router.post('/submit-answer', authenticateToken, authorizeRoles('user') , UsersController.submitQuestionAnswer);

// getById
router.get('/:id', authenticateToken, authorizeRoles('admin'), UsersController.getById);
// update
router.put('/:id', authenticateToken, authorizeRoles('admin'), UsersController.updateRole);

// delete
router.delete('/:id', authenticateToken, authorizeRoles('admin'), UsersController.deleteUser);

module.exports = router;