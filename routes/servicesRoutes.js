const express = require('express');
const servicesController = require('../controllers/servicesController')

let route = express.Router();

// get all services
route.get('/', servicesController.index);

module.exports = route;