const express = require('express');
const professionalsController = require('../controllers/professionalsController');
const coverageareasController = require('../controllers/coverageareasController');
const authProfessionalController = require('../controllers/authProfessionalController');
const professionalServicesController = require('../controllers/professionalServicesController');
const route = express.Router();
const professionalAuthentication = require('../middleware/professionalAuthentication');
const upload = require('../middleware/professionalsUpload');


route.get('/login', authProfessionalController.professionalCreate);
route.post('/login', authProfessionalController.professionalStore);

route.get("/", professionalsController.index)

// get a form for creating a new professional
route.get('/new', professionalsController.new);

// display an admin area 
route.get('/:id/admin', professionalAuthentication, professionalsController.admin);

// get a form for editing a professional
route.put('/:id/edit', professionalAuthentication, upload.any(), professionalsController.put);

// create new
route.post('/:id/neighborhoods', professionalAuthentication, coverageareasController.create);
route.get('/:id/:idP/neighborhoods', professionalAuthentication, coverageareasController.delete);


route.post('/:id/services', professionalAuthentication, professionalServicesController.create);
route.get('/:id/:idS/services', professionalAuthentication, professionalServicesController.delete);

// display a specific professional
route.get('/:id', professionalsController.show);

// create a new user
route.post('/create', professionalsController.create);

// create a new professional
// route.post('/', (req,res)=>{
// });

// update a specific professional
//route.put('/:id', (req,res)=>{
//});

// destroy a specific professional
//route.delete('/:id', (req,res)=>{
//});

module.exports = route;