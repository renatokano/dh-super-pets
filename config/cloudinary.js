require('dotenv').config();
const cloudinary = require('cloudinary');

cloudinary.config({  
  cloud_name: "superpets",  
  api_key: process.env.CLOUDINARY_API_KEY,  
  api_secret: process.env.CLOUDINARY_API_SECRET
});  

module.exports = cloudinary;