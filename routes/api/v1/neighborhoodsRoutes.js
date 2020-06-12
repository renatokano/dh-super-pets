const express = require('express');
const routes = express.Router();
const neighborhoodsController = require('../../../controllers/api/v1/neighborhoodsController');

routes.get('/', neighborhoodsController.index);

module.exports = routes;