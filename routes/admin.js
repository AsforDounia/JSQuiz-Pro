const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const AdminController = require('../controllers/AdminController');

const authenticateToken = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorize');

router.get('/', authenticateToken, authorizeRoles('admin'), UsersController.getAll);

router.get('/dashboard', authenticateToken, authorizeRoles('admin') ,AdminController.renderDashboard);




module.exports = router;