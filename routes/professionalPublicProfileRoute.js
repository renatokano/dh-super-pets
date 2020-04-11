const express = require('express');

let route = express.Router();

route.get('/professionalpublicprofile', (req,res)=>{
  res.render('professionalPublicProfile');
});


module.exports = route;