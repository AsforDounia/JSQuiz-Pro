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
            // order: [[{ model: Question, as: 'questions' }, 'id', 'ASC']]
            });
            // score board users


            // const users = await User.findAll();

            const users = await User.findAll({
                include: [
                    {
                        model: Score,
                        as: 'scores',
                        attributes: ['id', 'score', 'thematique_id', 'played_at'],
                        include: [
                            {
                                model: Theme,
                                as: 'theme',
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            });

            // calcule moyenne score  for each user
            users.forEach(user => {
                const completed = user.scores ? user.scores.length : 0;
                const avgScore = completed > 0 ? Math.round(user.scores.reduce((sum, s) => sum + s.score, 0) / completed) : 0;
                user.completed = completed;
                user.avgScore = avgScore;
            });
            res.render('admin/dashboard', {
                quizzes: themes ,
                users : users,
                user: req.user,
                layout: 'layouts/main',
            });
        } catch (error) {
            res.status(500).send('Error loading quizzes');
        }
    },
}