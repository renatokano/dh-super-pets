const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash-messages')

const app = express();

const PORT = process.env.PORT || 3000;

// Import Routes 
const indexRoutes = require('./routes/indexRoutes');
const usersRoutes = require('./routes/usersRoutes');
const professionalsRoutes = require('./routes/professionalsRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const localSessionMiddleware = require('./middleware/localSession');

const dbtestRoutes = require('./routes/dbtestRoutes');


const servicesAPIv1Routes = require('./routes/api/v1/servicesRoutes');
const neighborhoodsAPIv1Routes = require('./routes/api/v1/neighborhoodsRoutes');
const pettypesAPIv1Routes = require('./routes/api/v1/petTypesRoutes');


// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "views"));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(
  session({
    secret: "HJn2pWEiKbemzxLoEy4GfzqEvubdMPpn9RbvDYKHPtw1iybfNkmVYf7rYoozEU",
    resave: true,
    saveUninitialized: true
  })
);
app.use(cookieParser());
app.use(flash());

// Routes
app.use(localSessionMiddleware);
app.use(indexRoutes);
app.use('/users', usersRoutes);
app.use('/professionals', professionalsRoutes);
app.use('/services', servicesRoutes);
app.use('/appointments', appointmentRoutes);

// API v1
app.use('/api/v1/services', servicesAPIv1Routes);
app.use('/api/v1/neighborhoods', neighborhoodsAPIv1Routes);
app.use('/api/v1/pettypes', pettypesAPIv1Routes);

// Routes for tests
// Use only in development environment
app.use('/dbtest', dbtestRoutes);

// 404
app.get('*', function(req, res){
  // create a error flash message
  req.flash('error', 'Página não encontrada! Verifique o endereço e tente novamente.');
  res.redirect('/');
});

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));