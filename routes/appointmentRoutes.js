const express = require('express');
const routes = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const clientAuthentication = require('../middleware/clientAuthentication');

routes.get('/:professionalId/:timeSlot/:serviceId', appointmentsController.create);

module.exports = routes;