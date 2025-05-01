'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  
  class Trainer extends Model {
    static associate(models) {
      // Связь между тренером и командой
      Trainer.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' }); // Связь с командой
      Trainer.hasMany(models.Fighter, { foreignKey: 'trainerId' });  // Связь с бойцом
    }
  }
  
  Trainer.init({
    name: DataTypes.STRING,  // Имя тренера
    experience: DataTypes.STRING,  // Опыт тренера (например, "5 лет")
    photo_url: DataTypes.STRING,  // Фото тренера
    teamId: {  // Внешний ключ на команду
      type: DataTypes.INTEGER,
      allowNull: true,  // Это поле может быть пустым, если тренер не привязан к команде
    },
  }, {
    sequelize,
    modelName: 'Trainer',
  });

  return Trainer;
};
