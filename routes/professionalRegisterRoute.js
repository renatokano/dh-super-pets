const express = require('express');

let route = express.Router();

route.get('/professionalregister', (req,res)=>{
  res.render('professionalRegister');
});


module.exports = route;