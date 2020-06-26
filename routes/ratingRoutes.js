const express = require('express');
const route = express.Router();
const ratingController = require('../controllers/ratingsController');

route.get('/professionals', ratingController.professionalRatings);

module.exports = route;