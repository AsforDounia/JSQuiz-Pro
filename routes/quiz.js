const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');
const authenticateToken = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorize');

router.get('/list', authenticateToken, QuizController.getQuizList);
router.get('/start/:quizType', authenticateToken, QuizController.startQuiz);


// Get all quizzes
router.get('/', QuizController.getAllQuizzes);

// Get a quiz by theme
router.get('/theme/:themeId', QuizController.getQuizByTheme);

// Delete all questions by theme
router.delete('/theme/:themeId', authenticateToken, authorizeRoles("admin"), QuizController.deleteQuiz );

module.exports = router;
