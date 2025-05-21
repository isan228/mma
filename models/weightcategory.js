'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WeightCategory extends Model {
    static associate(models) {
      WeightCategory.hasMany(models.Fighter, { foreignKey: 'weightCategoryId', as: 'fighters' });
    }
  }

  WeightCategory.init({
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'WeightCategory',
  });

  return WeightCategory;
};
