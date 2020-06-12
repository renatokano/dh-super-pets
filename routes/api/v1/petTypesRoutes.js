const express = require('express');
const routes = express.Router();
const petTypesController = require('../../../controllers/api/v1/petTypesController');

routes.get('/', petTypesController.index);

module.exports = routes;