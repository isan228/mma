const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Конфигурируем Cloudinary
cloudinary.config({
  cloud_name: 'dpdbblizf', // Замените на ваш cloud_name
  api_key: '551671769166255', // Замените на ваш api_key
  api_secret: 'BN4WB-2pGqjHXH4DceAPQOukKUM' // Замените на ваш api_secret
});

// Настройка хранилища для Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Папка в Cloudinary для хранения изображений
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'], // Разрешенные форматы
  },
});

// Создаем multer с использованием настроек Cloudinary
const upload = multer({ storage });

module.exports = upload;
