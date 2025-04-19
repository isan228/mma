'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Fighter extends Model {
    static associate(models) {
      // Связь с командой (одна команда может иметь много бойцов)
      Fighter.belongsTo(models.Team, { foreignKey: 'teamId' });
      // Связь с матчами (один боец может участвовать в нескольких матчах)
      Fighter.hasMany(models.Match, { foreignKey: 'fighterId' });
    }
  }

  Fighter.init({
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    country: DataTypes.STRING,
    height: DataTypes.FLOAT,
    weight: DataTypes.FLOAT,
    category: DataTypes.STRING,
    style: DataTypes.STRING,
    photo_url: DataTypes.STRING,
    teamId: DataTypes.INTEGER, // Связь с командой
    trainerId: DataTypes.INTEGER,  // Добавляем поле для тренера
    wins: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // По умолчанию 0 побед
    },
    losses: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // По умолчанию 0 поражений
    },
    record: {
      type: DataTypes.STRING,
      allowNull: true, // Будет хранить текстовый проф. рекорд
    }
  }, {
    sequelize,
    modelName: 'Fighter',
  });

  return Fighter;
};
