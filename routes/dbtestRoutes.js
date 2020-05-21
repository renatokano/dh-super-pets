const express = require('express');
const dbtestController = require('../controllers/dbtestController');
const route = express.Router();

/* 
  Test Database Connection
  e.g. http://localhost:3000/dbtest/
*/
route.get('/', dbtestController.dbconnection);

/*
  ORM [neighborhoods <-> cities <-> states] (2 inner-joins)

  SELECT `Neighborhood`.`id`, `Neighborhood`.`name`, `Neighborhood`.`city_id`, `City`.`id` AS `City.id`, `City`.`name` AS `City.name`, `City`.`state_id` AS `City.state_id`, `City->State`.`id` AS `City.State.id`, `City->State`.`name` AS `City.State.name` FROM `neighborhoods` AS `Neighborhood` INNER JOIN `cities` AS `City` ON `Neighborhood`.`city_id` = `City`.`id` INNER JOIN `states` AS `City->State` ON `City`.`state_id` = `City->State`.`id` ORDER BY `Neighborhood`.`name` ASC;

  e.g. http://localhost:3000/dbtest/neighborhoods/cities 
*/
route.get('/neighborhoods/cities', dbtestController.select_all_neighborhoods);

// SELECT * FROM neighborhoods (raw-queries)
// e.g.: http://localhost:3000/dbtest/neighborhoods/all
route.get('/:entity/all', dbtestController.select_all);

// CREATE A NEW CLIENT
route.get('/clients/generate', dbtestController.create_new_client);

// CREATE A NEW PET
route.get('/clients/:id/pet/generate', dbtestController.create_new_pet);

// GET ALL PETS FROM A SPECIFIC CLIENT
route.get('/clients/:id/pets', dbtestController.select_all_pets_from_a_client);

// SELECT * FROM pet_types WHERE id=1 (raw-queries)
// e.g.: http://localhost:3000/dbtest/pet_types/1
route.get('/:entity/:id', dbtestController.select_from_id);

module.exports = route;