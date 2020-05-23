const express = require('express');
const usersController = require('../controllers/usersController');

let route = express.Router();

// display a list of all users
//route.get('/', (req,res)=>{
//  res.render('/users/index');
//});

// get a form for creating a new user
route.get('/new', usersController.new);

// display an admin area 
route.get('/:id/admin', usersController.admin);

// get a form for editing an user
route.get('/:id/edit', usersController.edit);

// display a specific user
route.get('/:id', usersController.show);

//create a new user
route.post('/create', usersController.create);

// update a specific user
//route.put('/:id', (req,res)=>{
//});

// destroy a specific user
//route.delete('/:id', (req,res)=>{
//});


module.exports = route;