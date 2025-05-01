'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Trainers', 'teamId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Teams',
        key: 'id'
      },
      onDelete: 'SET NULL',  // При удалении команды поле teamId станет NULL
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Trainers', 'teamId');
  }
};
