const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Register Form
router.get('/register', AuthController.RegisterForm);

// Register
router.post('/register', AuthController.register);

// Login Form
router.get('/login', AuthController.LoginForm);
// Login
router.post('/login', AuthController.login);


module.exports = router;
