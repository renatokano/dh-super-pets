const express = require('express');

let route = express.Router();

route.get('/useradmprofile', (req,res)=>{
  res.render('userAdmProfile');
});


module.exports = route;