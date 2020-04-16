const express = require('express');
const methodOverride = require('method-override');
const app = express();

const PORT = 3000;

// Import Routes 
let indexRoutes = require('./routes/indexRoutes');
let userRoutes = require('./routes/usersRoutes');
let professionalsRoutes = require('./routes/professionalsRoutes');
let servicesRoutes = require('./routes/servicesRoutes');

// Middlewares
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

// Routes
app.use(indexRoutes);
app.use('/users', userRoutes);
app.use('/professionals', professionalsRoutes);
app.use('/services', servicesRoutes);

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));