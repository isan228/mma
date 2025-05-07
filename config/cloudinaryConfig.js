const cloudinary = require('cloudinary').v2;

// Настройка Cloudinary с твоими данными
cloudinary.config({
  cloud_name: 'ТВОЕ_ИМЯ_КЛАУДА',
  api_key: 'ТВОЙ_API_KEY',
  api_secret: 'ТВОЙ_API_SECRET'
});

module.exports = cloudinary;
