const express = require('express');
const servicesController = require('../controllers/servicesController')

let route = express.Router();

// get all services
route.get('/', servicesController.index);

// get dog-grooming service
route.get('/dog-grooming', servicesController.dogGrooming);

// get dog-walking service
route.get('/dog-walking', servicesController.dogWalking);

// get pet-baths service
route.get('/pet-baths', servicesController.petBaths);

// get pet-sitting service
route.get('/pet-sitting', servicesController.petSitting);

// get pet-training service
route.get('/pet-training', servicesController.petTraining);

module.exports = route;