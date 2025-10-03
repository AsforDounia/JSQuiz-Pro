const { Score, Theme } = require('../models');
const User = require('../models/User');

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
        // Example: total time = number of quizzes * 2 min (replace with your logic if you have time data)
        const userTotalTime = userScores.reduce((sum, s) => sum + (s.duration || 2), 0); // duration in minutes, fallback 2
        // Example: best streak (replace with the name of the quiz have better score)
        
        const bestScore = userScores.length > 0 ? Math.max(...userScores.map(s => s.score)) : 0;
        const userStats = {
            completed: userCompleted,
            avgScore: userAvgScore,
            totalTime: userTotalTime,
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
    }

}


