const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Theme = require('./Theme');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  thematique_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'thematiques',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  correct_answers: {
    type: DataTypes.JSON,
    allowNull: false,
  },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   updated_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
}, {
  tableName: 'questions',
  timestamps: false,
  underscored: true,
});

Question.belongsTo(Theme, { foreignKey: 'thematique_id', as: 'theme' });

module.exports = Question;
