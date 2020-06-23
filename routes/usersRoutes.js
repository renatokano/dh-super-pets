const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const petsController = require('../controllers/petsController');
const router = express.Router();
const clientAuthentication = require('../middleware/clientAuthentication');
const clientsUpload = require('../middleware/clientsUpload');
const petsUpload = require('../middleware/petsUpload');
const formDataMiddleware = require('../middleware/formData');

// display a list of all users
//router.get('/', (req,res)=>{
//  res.render('/users/index');
//});

// user sign in
router.get('/login', authController.userCreate);
router.post('/login', authController.userStore);

// get a form for creating a new user
router.get('/new', formDataMiddleware, usersController.new);

// display an admin area 
router.get('/:id/admin', clientAuthentication, usersController.admin);

// get all pets from an user
router.get('/:id/pets', clientAuthentication, petsController.show);

// update a specific pet
router.put('/:id/pets', clientAuthentication, petsUpload.any(),petsController.put);

// create new pet
router.post('/:id/pets', clientAuthentication, petsUpload.any(),  petsController.create);

// get a form for editing an user
router.put('/:id', clientAuthentication, clientsUpload.any(), usersController.put);

// display a specific user
router.get('/:id', usersController.show);

// create a new user
router.post('/create', usersController.create);

// update a specific user
//router.put('/:id', (req,res)=>{
//});

// destroy a specific user
//router.delete('/:id', (req,res)=>{
//});


module.exports = router;