const { Question, Theme } = require('../models');

module.exports = {
    // Get all questions, optionally filtered by theme
    async getAll(req, res) {
        try {
            const { themeId } = req.query;
            let where = {};
            if (themeId) {
                where.thematique_id = themeId;
            }
            const questions = await Question.findAll({
                where,
                include: [{ model: Theme, as: 'theme', attributes: ['id', 'name'] }]
            });
            res.json(questions);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get a single question by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const question = await Question.findByPk(id, {
                include: [{ model: Theme, as: 'theme', attributes: ['id', 'name'] }]
            });
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }
            res.json(question);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Create a new question
    async create(req, res) {
        try {
            const { thematique_id, question, options, correct_answers } = req.body;

            if (!thematique_id || !question || !options || !correct_answers) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Validate theme exists
            const theme = await Theme.findByPk(thematique_id);
            if (!theme) {
                return res.status(404).json({ message: 'Theme not found' });
            }

            // Validate options and correct_answers are arrays
            if (!Array.isArray(options) || options.length === 0) {
                return res.status(400).json({ message: 'Options must be a non-empty array' });
            }
            if (!Array.isArray(correct_answers) || correct_answers.length === 0) {
                return res.status(400).json({ message: 'Correct answers must be a non-empty array' });
            }

            const newQuestion = await Question.create({
                thematique_id,
                question,
                options,
                correct_answers
            });

            res.status(201).json({ message: 'Question created', data: newQuestion });
        } catch (error) {
            console.error('Failed to create question:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Update a question
    async update(req, res) {
        try {
            const { id } = req.params;
            const { thematique_id, question, options, correct_answers } = req.body;

            const q = await Question.findByPk(id);
            if (!q) {
                return res.status(404).json({ message: 'Question not found' });
            }

            if (thematique_id) {
                const theme = await Theme.findByPk(thematique_id);
                if (!theme) {
                    return res.status(404).json({ message: 'Theme not found' });
                }
                q.thematique_id = thematique_id;
            }
            if (question) q.question = question;
            if (options) {
                if (!Array.isArray(options) || options.length === 0) {
                    return res.status(400).json({ message: 'Options must be a non-empty array' });
                }
                q.options = options;
            }
            if (correct_answers) {
                if (!Array.isArray(correct_answers) || correct_answers.length === 0) {
                    return res.status(400).json({ message: 'Correct answers must be a non-empty array' });
                }
                q.correct_answers = correct_answers;
            }

            q.updated_at = new Date();

            await q.save();

            res.json({ message: 'Question updated successfully', data: q });
        } catch (error) {
            console.error('Failed to update question:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Delete a question
    async delete(req, res) {
        try {
            const { id } = req.params;
            const q = await Question.findByPk(id);
            if (!q) {
                return res.status(404).json({ message: 'Question not found' });
            }
            await q.destroy();
            res.json({ message: 'Question deleted successfully' });
        } catch (error) {
            console.error('Failed to delete question:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },



    
};
