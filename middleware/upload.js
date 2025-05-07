const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Конфигурируем Cloudinary
cloudinary.config({
  cloud_name: 'dpdbblizf',  // Заменить на свой cloud_name
  api_key: '551671769166255',  // Заменить на свой api_key
  api_secret: 'BN4WB-2pGqjHXH4DceAPQOukKUM'  // Заменить на свой api_secret
});

// Настроить хранилище для Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Папка для хранения изображений в Cloudinary
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'], // Разрешенные форматы
  },
});

// Создаем multer с использованием настроек Cloudinary
const upload = multer({ storage });

module.exports = upload;