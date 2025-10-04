const Question = require('../models/Question');
const Theme = require('../models/Theme');



module.exports = {
  async getQuizList(req, res) {
    try {
      const themes = await Theme.findAll({
        attributes: ["id", "name"],
      });

      res.render("quiz/quiz-list", { themes: themes });
    } catch (error) {
      console.error("Failed to get quiz list:", error);
      res
        .status(500)
        .render("error", { message: "Erreur lors du chargement des quiz" });
    }
  },

  async startQuiz(req, res) {
    try {
      const { quizType } = req.params;
      const questionIndex = parseInt(req.query.question) || 0;

      // Trouver le thème correspondant au type
      const theme = await Theme.findOne({
        where: { name: quizType },
      });

      if (!theme) {
        return res.render("quiz/questions", { 
          quizType: quizType,
          hasData: false,
          message: "Thème de quiz non trouvé",
          theme: null,
          questions: [],
          currentQuestion: 0,
          totalQuestions: 0
        });
      }

      // Récupérer les questions pour ce thème
      const questions = await Question.findAll({
        where: { thematique_id: theme.id },
        attributes: ["id", "question", "options" , "correct_answers"],
        order: [["id", "ASC"]],
      });

      if (questions.length === 0) {
        return res.render("quiz/questions", { 
          quizType: quizType,
          hasData: false,
          message: "Aucune question trouvée pour ce thème",
          theme: theme,
          questions: [],
          currentQuestion: 0,
          totalQuestions: 0
        });
      }

      // Vérifier que l'index de la question est valide
      if (questionIndex < 0 || questionIndex >= questions.length) {
        return res.status(404).render("error", { 
          message: "Question non trouvée" 
        });
      }
  
      res.render("quiz/questions", {
        theme: theme,
        questions: questions,
        quizType: quizType,
        currentQuestion: questionIndex,
        totalQuestions: questions.length,
        hasData: true
      });
    } catch (error) {
      console.error("Failed to start quiz:", error);
      res.status(500).render("error", { 
        message: "Erreur lors du démarrage du quiz" 
      });
    }
  },

  
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
            res.render("quiz/quiz-list", { themes: themes });
            // res.json({ quizzes: themes });
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
