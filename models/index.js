'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Автоматически подключаем все модели
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&          // не скрытый файл
      file !== basename &&               // не index.js
      file.slice(-3) === '.js' &&        // только .js файлы
      !file.endsWith('.test.js')         // пропускаем тесты
    );
  })
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    console.log(`📄 Загружается модель: ${file}`);

    const modelModule = require(modelPath);
    
    if (typeof modelModule !== 'function') {
      console.error(`❌ Файл ${file} не экспортирует функцию. Он будет пропущен.`);
      return;
    }

    const model = modelModule(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Настройка связей между моделями (если есть)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
