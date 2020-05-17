const express = require('express');
const dbtestController = require('../controllers/dbtestController');
const route = express.Router();

// test database connection
route.get('/', dbtestController.dbconnection);

// SELECT * FROM neighborhoods
// e.g.: http://localhost:3000/dbtest/neighborhoods/all
route.get('/:entity/all', dbtestController.select_all);

// SELECT * FROM pet_types WHERE id=1
// e.g.: http://localhost:3000/dbtest/pet_types/1
route.get('/:entity/:id', dbtestController.select_from_id);

module.exports = route;