const express = require('express');
const route = express.Router();
const newsletterController = require('../controllers/newsletterController');

route.get('/:email', newsletterController.create);

module.exports = route;