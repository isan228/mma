'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  
  class Trainer extends Model {
    static associate(models) {
      Trainer.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });
      Trainer.hasMany(models.Fighter, { foreignKey: 'trainerId' });
    }
  }
  
  Trainer.init({
    name: DataTypes.STRING,
    experience: DataTypes.STRING,
    photo_url: DataTypes.STRING,
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sports: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Виды спорта, которыми занимается тренер (текстовое описание)',
    },
    achievements: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Заслуги тренера (текстовое описание)',
    },
  }, {
    sequelize,
    modelName: 'Trainer',
  });

  return Trainer;
};
