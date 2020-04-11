const express = require('express');

let route = express.Router();

route.get('/professionaladmprofile', (req,res)=>{
  res.render('professionalAdmProfile');
});


module.exports = route;