const express = require('express');
const dbtestController = require('../controllers/dbtestController');
const route = express.Router();

/****************************************************************
 *    DATABASE CONNECTION TEST
 *    e.g. http://localhost:3000/dbtest/
****************************************************************/

route.get('/', dbtestController.dbconnection);


/****************************************************************
 *    GENERATE NEW DATA
****************************************************************/

// CREATE A NEW CLIENT
route.get('/clients/generate', dbtestController.create_new_client);

// CREATE A NEW PET
route.get('/clients/:id/pet/generate', dbtestController.create_new_pet);

// CREATE A NEW PROFESSIONAL
route.get('/professionals/generate', dbtestController.create_new_professional);

// CREATE A NEW PROFESSIONAL AREA
route.get('/professionals/:id/area/generate', dbtestController.create_new_area);

// CREATE A NEW PROFESSIONAL SERVICE
route.get('/professionals/:id/service/generate', dbtestController.create_new_professional_service);


/****************************************************************
 *    SELECT W/ JOINS
****************************************************************/

// Clients -> Neighborhoods -> Cities -> States
// Clients -> Pets -> PetTypes
route.get('/clients/complete', dbtestController.select_all_clients);

// Professionals -> Neighborhoods -> City -> State
// Professionals -> CoverageAreas -> Neighborhoods -> City -> State
// Professionals -> ProfessionalServices -> Services
route.get('/professionals/complete', dbtestController.select_all_professionals);

// Clients -> Neighborhoods -> Cities -> States
// Clients -> Pets -> PetTypes
route.get('/clients/:id/complete', dbtestController.select_all_details_about_a_client);

/****************************************************************
 *    J/A SELECT W/ JOINS EXAMPLES USING RAW-QUERIES
****************************************************************/

// Neighborhoods -> Cities -> States (raw-queries)
// e.g. http://localhost:3000/dbtest/neighborhoods/cities 
route.get('/neighborhoods/cities', dbtestController.select_all_neighborhoods);

// SELECT * FROM neighborhoods (raw-queries)
// e.g.: http://localhost:3000/dbtest/neighborhoods/all
route.get('/:entity/all', dbtestController.select_all);

// SELECT * FROM pet_types WHERE id=1 (raw-queries)
// e.g.: http://localhost:3000/dbtest/pet_types/1
route.get('/:entity/:id', dbtestController.select_from_id);


module.exports = route;