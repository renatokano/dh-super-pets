const express = require('express');
const routes = express.Router();
const servicesController = require('../../../controllers/api/v1/servicesController');

routes.get('/', servicesController.index);

module.exports = routes;

