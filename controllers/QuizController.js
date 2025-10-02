const { Theme, Question } = require('../models');

module.exports = {
    // Get all Quizzes
    async getAllQuizzes(req, res) {
        try {
            // Fetch all themes
            const themes = await Theme.findAll({
                attributes: ['id', 'name'],
                include: [{
                    model: Question,
                    as: 'questions', // Make sure the association is defined in the model
                    attributes: ['id', 'question', 'options', 'correct_answers']
                }]
            });

            res.json({ quizzes: themes });
        } catch (error) {
            console.error('Failed to get all quizzes:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Get a quiz by theme
    async getQuizByTheme(req, res) {
        try {
            const { themeId } = req.params;
            // Check if theme exists
            const theme = await Theme.findByPk(themeId);
            if (!theme) {
                return res.status(404).json({ message: 'Theme not found' });
            }
            // Fetch all questions for the theme
            const questions = await Question.findAll({
                where: { thematique_id: themeId },
                attributes: ['id', 'question', 'options' , 'correct_answers'],
            });
            res.json({
                theme: { id: theme.id, name: theme.name },
                questions
            });
        } catch (error) {
            console.error('Failed to get quiz by theme:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Delete all questions by theme
    async deleteQuiz(req, res) {
        try {
            const { themeId } = req.params;
            await Question.destroy({ where: { thematique_id: themeId } });
            res.json({ message: 'Questions deleted successfully' });
        } catch (error) {
            console.error('Failed to delete questions:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

};
