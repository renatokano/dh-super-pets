const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.json')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Professional } = require('../models/index');
const bcrypt = require('bcrypt');

const controller = {
  
  professionalCreate: (req, res) => {
    res.render('auth/professional_login');
  },
  
  professionalStore: async (req, res) => {
    const {email, password=''} = req.body;
    const professional = await Professional.findOne({
      where: {
        email
      },
      attributes: ['id', 'name', 'email', 'password']
    });

    const password_confirmation = await bcrypt.compare(password, professional.password);

    if(!professional || !password_confirmation) return res.render('auth/professional_login', {
      alert: {
        msg: "Usuário ou senha inválidos",
        type: "danger"
      }
    });

    const uuid = uuid_generate(professional);

    // create a session
    req.session.professional = {
      id: professional.id,
      name: professional.name,
      email: professional.email,
      uuid
    }

    return res.redirect(`/professionals/${uuid}/admin`); 
  },
  // GET /logout
  logout: (req, res, next) => {
    if(req.session){
      req.session.destroy(error => {
        return error ? next(err) : res.redirect('/');
      })
    }
    next();
  }
}

const uuid_generate = function (professional) {
  return `${professional.id}-${professional.name.toLowerCase().replace(/\s+/g, '-')}`
}

module.exports = controller;