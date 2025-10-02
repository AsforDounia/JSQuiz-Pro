const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Register Form
router.get('/register', AuthController.RegisterForm);

// Register
router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', AuthController.register);

// Login Form
router.get('/login', AuthController.LoginForm);
// Login
router.post('/login', AuthController.login);


// Logout
router.post('/logout', AuthController.logout);

module.exports = router;

