// migrations/20250418225100-create-trainer.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trainers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      experience: {
        type: Sequelize.STRING
      },
      photo_url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Добавляем поле trainerId в таблицу Fighters для связи с тренером
    await queryInterface.addColumn('Fighters', 'trainerId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Trainers', // Имя модели тренеров
        key: 'id'
      },
      onDelete: 'SET NULL' // Если тренер удаляется, устанавливаем trainerId как NULL
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Fighters', 'trainerId');
    await queryInterface.dropTable('Trainers');
  }
};
