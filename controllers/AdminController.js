const Quiz = require('../controllers/QuizController'); // Make sure this path is correct
const { Theme, Question, User, Score } = require('../models');

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
            order: [[{ model: Question, as: 'questions' }, 'id', 'ASC']]
            });

            // score board users


            // const users = await User.findAll();

            const users = await User.findAll({
                include: [
                    {
                        model: Score,
                        as: 'scores', // Make sure this matches your association
                        attributes: ['id', 'score', 'thematique_id', 'played_at'],
                        include: [
                            {
                                model: Theme,
                                as: 'theme', // Make sure this matches your association
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            });

            res.render('admin/dashboard', { quizzes: themes , users : users});
        } catch (error) {
            res.status(500).send('Error loading quizzes');
        }
    },
}