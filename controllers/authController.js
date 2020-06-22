const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.js')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Client, Professional } = require('../models/index');
const bcrypt = require('bcrypt');

const controller = {
  userCreate: (req, res) => {
    res.render('auth/user_login');
  },
  userStore: async (req, res) => {
    const {email, password=''} = req.body;
    const user = await Client.findOne({
      where: {
        email
      },
      attributes: ['id', 'name', 'email', 'password']
    });

    const password_confirmation = await bcrypt.compare(password, user.password);

    if(!user || !password_confirmation) return res.render('auth/user_login', {
      alert: {
        msg: "Usuário ou senha inválidos",
        type: "danger"
      }
    });

    // generate an uuid
    const uuid = uuid_generate(user);

    // create a session
    req.session.client = {
      id: user.id,
      name: user.name,
      email: user.email,
      uuid
    }

    return res.redirect(`/users/${uuid}/admin`); 
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

const uuid_generate = function (user) {
  return `${user.id}-${user.name.toLowerCase().replace(/\s+/g, '-')}`
}

module.exports = controller;