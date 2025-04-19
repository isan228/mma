'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      // Связь с бойцом
      Team.hasMany(models.Fighter, { foreignKey: 'teamId' });
    }
  }
  Team.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};
