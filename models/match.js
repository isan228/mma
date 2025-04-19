'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
  
    static associate(models) {
      
      Match.belongsTo(models.Fighter, { foreignKey: 'fighterId' });
    }
   
  }
  Match.init({
    opponent_name: DataTypes.STRING,
    date: DataTypes.DATE,
    result: DataTypes.STRING,
    method: DataTypes.STRING,
    event_name: DataTypes.STRING,
    fighterId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Match',
  });
  return Match;
};
