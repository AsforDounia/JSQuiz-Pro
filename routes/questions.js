const express = require('express');
const router = express.Router();
const QuestionsController = require('../controllers/QuestionsController');
const authenticateToken = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorize');

// Get all questions (optionally filtered by theme)
router.get('/', QuestionsController.getAll);

// Get a single question by ID
router.get('/:id', QuestionsController.getById);

// Create a new question
router.post('/', authenticateToken, authorizeRoles('admin'), QuestionsController.create);

// Update a question
router.put('/:id', authenticateToken, authorizeRoles('admin'), QuestionsController.update);

// Delete a question
router.delete('/:id', authenticateToken, authorizeRoles('admin'), QuestionsController.delete);

module.exports = router;
