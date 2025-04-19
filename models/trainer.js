// models/trainer.js
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Trainer extends Model {
    static associate(models) {
      // Связь между тренером и бойцом
      Trainer.hasMany(models.Fighter, { foreignKey: 'trainerId' });
    }
  }
  
  Trainer.init({
    name: DataTypes.STRING,  // Имя тренера
    experience: DataTypes.STRING,  // Опыт тренера (например, "5 лет")
    photo_url: DataTypes.STRING,  // Фото тренера
  }, {
    sequelize,
    modelName: 'Trainer',
  });

  return Trainer;
};
