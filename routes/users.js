const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const authenticateToken = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorize');

router.get('/dashboard', authenticateToken, authorizeRoles('user') ,UsersController.renderDashboard);




module.exports = router;