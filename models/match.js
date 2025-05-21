'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    static associate(models) {
      // Связи с бойцами
      Match.belongsTo(models.Fighter, { foreignKey: 'fighterId', as: 'Fighter' });
      Match.belongsTo(models.Fighter, { foreignKey: 'opponentId', as: 'Opponent' });

      // Связь с турниром
      Match.belongsTo(models.Tournament, { foreignKey: 'tournamentId' });
       Match.belongsTo(models.WeightCategory, { foreignKey: 'weightCategoryId', as: 'weightCategory' });
             Match.belongsTo(models.Sport, { foreignKey: 'sportId', as: 'sport' });
    }
  }

  Match.init({
    fighterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    opponentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tournamentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    result: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
     weightCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
     sportId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Match',
  });

  return Match;
};
