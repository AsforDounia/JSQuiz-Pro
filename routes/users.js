const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const authenticateToken = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorize');

router.get('/dashboard', authenticateToken, authorizeRoles('user') ,UsersController.renderDashboard);

// Submit answer
router.post('/submit-answer', authenticateToken, authorizeRoles('user') , UsersController.submitQuestionAnswer);



module.exports = router;