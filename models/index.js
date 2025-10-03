const Theme = require('./Theme');
const Question = require('./Question');
const User = require('./User');
const Score = require('./Score');

// Define associations here
Theme.hasMany(Question, { foreignKey: 'thematique_id', as: 'questions' });
Question.belongsTo(Theme, { foreignKey: 'thematique_id', as: 'theme' });

// User has many Scores
User.hasMany(Score, { as: 'scores', foreignKey: 'user_id' });
Score.belongsTo(User, { foreignKey: 'user_id' });

// Score belongs to Theme (as 'theme')
Score.belongsTo(Theme, { foreignKey: 'thematique_id', as: 'theme' });
Theme.hasMany(Score, { foreignKey: 'thematique_id', as: 'scores' });

module.exports = {
    Theme,
    Question,
    Score,
    User
};