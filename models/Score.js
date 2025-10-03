const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Score = sequelize.define('Score', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
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
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    played_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'scores',
    timestamps: false,
});

module.exports = Score;