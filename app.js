const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Import Routes 
let indexRoutes = require('./routes/indexRoutes');
let usersRoutes = require('./routes/usersRoutes');
let professionalsRoutes = require('./routes/professionalsRoutes');
let servicesRoutes = require('./routes/servicesRoutes');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

// Routes
app.use(indexRoutes);
app.use('/users', usersRoutes);
app.use('/professionals', professionalsRoutes);
app.use('/services', servicesRoutes);

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));