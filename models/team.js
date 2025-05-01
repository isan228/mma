'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Team.associate = (models) => {
    Team.hasMany(models.Fighter, { foreignKey: 'teamId', as: 'fighters' }); // Используем teamId
  };


  return Team;
};
