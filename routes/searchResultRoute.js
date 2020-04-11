const express = require('express');

let route = express.Router();

route.get('/searchresult', (req,res)=>{
  res.render('searchResult');
});


module.exports = route;