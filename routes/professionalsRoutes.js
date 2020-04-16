const express = require('express');
const professionalsController = require('../controllers/professionalsController');

let route = express.Router();

// display a list of all professionals
route.get('/', professionalsController.index);

// get a form for creating a new professional
route.get('/new', professionalsController.new);

// display an admin area 
route.get('/:id/admin', professionalsController.admin);

// get a form for editing a professional
route.get('/:id/edit', professionalsController.edit);

// display a specific professional
route.get('/:id', professionalsController.show);

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