const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const authenticateToken = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorize');

router.get('/', authenticateToken, authorizeRoles('admin'), UsersController.getAll);

router.get('/dashboard', authenticateToken, authorizeRoles('admin') , (req, res) =>{
    res.render('admin/dashboard');
});




module.exports = router;