const Theme = require('./Theme');
const Question = require('./Question');

// Define associations here
Theme.hasMany(Question, { foreignKey: 'thematique_id', as: 'questions' });
Question.belongsTo(Theme, { foreignKey: 'thematique_id', as: 'theme' });

module.exports = {
  Theme,
  Question,
};