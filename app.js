const express = require('express');
const methodOverride = require('method-override');

const app = express();

let rotasIndex = require('./routes/indexRoute');
let rotaUserRegister = require('./routes/userRegisterRoute');
let rotaProfessionalRegister = require('./routes/professionalRegisterRoute');
let rotaUserPublicProfile = require('./routes/userPublicProfileRoute');
let rotaProfessionalPublicProfile = require('./routes/professionalPublicProfileRoute');
let rotaUserAdmProfile = require('./routes/userAdmProfileRoute');
let rotaProfessionalAdmProfile = require('./routes/professionalAdmProfileRoute');
let rotaSearchResult = require('./routes/searchResultRoute');

app.use(express.static('public'));
app.set('view engine','ejs');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(rotasIndex);
app.use(rotaUserRegister);
app.use(rotaProfessionalRegister);
app.use(rotaUserPublicProfile);
app.use(rotaProfessionalPublicProfile);
app.use(rotaUserAdmProfile);
app.use(rotaProfessionalAdmProfile);
app.use(rotaSearchResult);

app.listen(3000, ()=>console.log("Servidor rodando na porta 3000"));