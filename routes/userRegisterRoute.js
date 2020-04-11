const express = require('express');

let route = express.Router();

route.get('/userregister', (req,res)=>{
  res.render('userRegister');
});


module.exports = route;