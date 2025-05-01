'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Fighter extends Model {
    static associate(models) {
      Fighter.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });
      Fighter.hasMany(models.Match, { foreignKey: 'fighterId', as: 'MatchesAsFighter' });
      Fighter.hasMany(models.Match, { foreignKey: 'opponentId', as: 'MatchesAsOpponent' });
    }

    // Виртуальное поле для возраста
    getAge() {
      const currentYear = new Date().getFullYear();
      return this.birthYear ? currentYear - this.birthYear : null;
    }
  }

  Fighter.init({
    name: DataTypes.STRING,
    gender: DataTypes.STRING, // добавлено поле "Пол"
    birthYear: DataTypes.INTEGER, // год рождения вместо возраста
    country: DataTypes.STRING,
    height: DataTypes.FLOAT,
    weight: DataTypes.FLOAT,
    category: DataTypes.STRING,
    style: DataTypes.STRING,
    photo_url: DataTypes.STRING,
    teamId: DataTypes.INTEGER,
    trainerId: DataTypes.INTEGER,
    wins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    losses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    record: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'Fighter',
  });

  return Fighter;
};
