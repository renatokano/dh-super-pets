const express = require('express');
const indexController = require('../controllers/indexController')

let route = express.Router();

// get home page
route.get('/', indexController.index);

// get about-us page
route.get('/about-us', indexController.aboutUs);

// get faq page
route.get('/faq', indexController.faq);

// get terms-of-use
route.get('/terms-of-use', indexController.termsOfUse);

module.exports = route;