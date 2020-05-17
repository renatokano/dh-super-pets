const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Import Routes 
const indexRoutes = require('./routes/indexRoutes');
const usersRoutes = require('./routes/usersRoutes');
const professionalsRoutes = require('./routes/professionalsRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const dbtestRoutes = require('./routes/dbtestRoutes');

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

// Routes for tests
// Use only in development environment
app.use('/dbtest', dbtestRoutes);

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));