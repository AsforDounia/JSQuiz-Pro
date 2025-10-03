const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');


// Register
router.get('/register', (req, res) => {
  res.render('auth/register', { 
    user: req.user,
    layout: 'layouts/auth',
    isRegister: true
  });
});

router.post('/register', AuthController.register);

// Login Form
router.get('/login', (req, res) => {
  res.render('auth/login', { 
    user: req.user,
    layout: 'layouts/auth',
    isRegister: false
});
});
// Login
router.post('/login', AuthController.login);


// Logout
router.post('/logout', AuthController.logout);

module.exports = router;

