const express = require('express');
const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');
const formDataMiddleware = require('../middleware/formData');

let route = express.Router();

// get home page
route.get('/', formDataMiddleware, indexController.index);

// get about-us page
route.get('/about-us', indexController.aboutUs);

// get faq page
route.get('/faq', indexController.faq);

// get terms-of-use
route.get('/terms-of-use', indexController.termsOfUse);

// get logout
route.get('/logout', authController.logout);

module.exports = route;