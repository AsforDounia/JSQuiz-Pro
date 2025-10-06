const { Score, Theme, User, Question } = require('../models');

module.exports = {
    // Render user dashboard
    async renderDashboard(req, res) {
        // Classement global des meilleurs joueurs (top 5).
        const topPlayers = await User.findAll({
            include: [{
                model: Score,
                as: 'scores',
                attributes: ['score', 'thematique_id', 'played_at'],
                include: [{
                    model: Theme,
                    as: 'theme',
                    attributes: ['name']
                }] 
            }],
            order: [[{ model: Score, as: 'scores' }, 'score', 'DESC']],
            limit: 5
        });

        topPlayers.forEach(player => {
            const completed = player.scores ? player.scores.length : 0;
            const avgScore = completed > 0 ? Math.round(player.scores.reduce((sum, s) => sum + s.score, 0) / completed) : 0;
            const points = player.scores ? player.scores.reduce((sum, s) => sum + s.score, 0) * 10 : 0;
            player.completed = completed;
            player.avgScore = avgScore;
            player.points = points;
        });

        // Fetch connected user's scores for stats
        const user = req.user;
        const userWithScores = await User.findByPk(user.id, {
            include: [{
                model: Score,
                as: 'scores',
                attributes: ['score', 'played_at', 'thematique_id']
            }]
        });

        const userScores = userWithScores.scores || [];
        const userCompleted = userScores.length;
        const userAvgScore = userCompleted > 0 ? Math.round(userScores.reduce((sum, s) => sum + s.score, 0) / userCompleted) : 0;

        const bestScore = userScores.length > 0 ? Math.max(...userScores.map(s => s.score)) : 0;
        const userStats = {
            completed: userCompleted,
            avgScore: userAvgScore,
            bestScore
        };

        res.render('user/dashboard', { 
            topPlayers,
            userStats,
            user: req.user,
            layout: 'layouts/main',
        });
    },
    // Fetch all users
    async getAll(req, res) {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },


    // Handle question answer submission
    async submitQuestionAnswer(req, res) {
        try {
            let { questionId : questionId, selectedAnswer, isLastQuestion, totalScore = 0, thematique_id } = req.body;

            const userId = req.user.id;

            // Get the question and correct answer
            const question = await Question.findByPk(questionId);

            if (!question) {
                return res.status(404).json({ success: false, message: 'Question not found' });
            }

            // Compare answer as text 
            const correctAnswers = question.correct_answers ? (Array.isArray(question.correct_answers) ? question.correct_answers : JSON.parse(question.correct_answers)) : [];
            const userAnswer = [(selectedAnswer || '')];

            const isCorrect = correctAnswers.some(
                ans => (ans || '') === (userAnswer[0] || '')
            );

            // Increment totalScore by 10 if correct
            if (isCorrect) {
                totalScore += 10;
            }

            // If this is the last question, save the total score
            if (isLastQuestion && typeof totalScore === 'number' && thematique_id) {
                await Score.create({
                    user_id: userId,
                    thematique_id,
                    score: totalScore,
                    played_at: new Date(),
                });
            }

            return res.json({
                success: true,
                correct: isCorrect,
                correctAnswer: question.answer,
                totalScore
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    },




    // Fetch a user by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },


    // Update user role
    async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (role) user.role = role;
            await user.save();
            return res.json({ message: 'User role updated successfully', data: user });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // deleteUser
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.destroy();
            return res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

}


