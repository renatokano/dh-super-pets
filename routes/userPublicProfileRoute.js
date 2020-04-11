const express = require('express');

let route = express.Router();

route.get('/userpublicprofile', (req,res)=>{
  res.render('userPublicProfile');
});


module.exports = route;