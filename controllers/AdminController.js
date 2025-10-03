const Quiz = require('../controllers/QuizController'); // Make sure this path is correct
const { Theme, Question } = require('../models');
const User = require('../models/User');

module.exports = {
    async renderDashboard(req, res) {
        try {
            const themes = await Theme.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                model: Question,
                as: 'questions',
                attributes: ['id', 'question', 'options', 'correct_answers']
                }
            ],
            order: [[{ model: Question, as: 'questions' }, 'id', 'asc']]
            });



            const users = await User.findAll();

            res.render('admin/dashboard', { quizzes: themes , users : users});
        } catch (error) {
            res.status(500).send('Error loading quizzes');
        }
    },
}