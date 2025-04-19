'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Fighters', 'wins', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0, // По умолчанию 0 побед
    });

    await queryInterface.addColumn('Fighters', 'losses', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0, // По умолчанию 0 поражений
    });
    
    // Также можно обновить столбец record на основе wins и losses
    await queryInterface.addColumn('Fighters', 'record', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Fighters', 'wins');
    await queryInterface.removeColumn('Fighters', 'losses');
    await queryInterface.removeColumn('Fighters', 'record');
  }
};
