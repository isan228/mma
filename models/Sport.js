'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    static associate(models) {
      // Один вид спорта может быть у многих бойцов
      Sport.hasMany(models.Fighter, { foreignKey: 'sportId', as: 'fighters' });
    }
  }

  Sport.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Sport',
    }
  );

  return Sport;
};
