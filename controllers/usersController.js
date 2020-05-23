const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.json')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Neighborhood, City, State, Client } = require('../models/index');
// hash/compare passwords
const bcrypt = require('bcrypt');
const { saltRounds } = require('../config/bcrypt');

const controller = {
  show: (req,res) => {
    res.render('users/show');
  },

  admin: async (req,res) => {
    return res.render('users/admin');
  },

  new: async (req,res) => {
    const cities = await City.findAll({
      include: {
        model: Neighborhood,
        require: true
      }
    });
    if (!cities) {
      return res.render('home/index', {
        alert: {
          message: "Ocorreu um erro, tente novamente!",
          type: "danger"
        }
      });
    }
    return res.render('users/new', {
      cities
    });
  },

  create: async (req, res) => {
    let { name, email, mobile, zipcode, address, neighborhood_id, city_id, state, password, 
      confirm_password, agree_terms_of_service } = req.body;
    const cities = await City.findAll({
      include: {
        model: Neighborhood,
        require: true
      }
    });
    if (!cities) {
      return res.render('home/index', {
        alert: {
          msg: "Ocorreu um erro, tente novamente!",
          type: "danger"
        }
      })
    }
    // password hash
    password = await bcrypt.hash(password, saltRounds);
    const password_confirmation = await bcrypt.compare(confirm_password, password);

    // validations
    if (agree_terms_of_service !== "on"){
      return res.render('users/new', {
        alert: {
          msg: "É necessário que leia e aceite os termos de serviço",
          type: "danger"
        },
        cities  
      })
    }
    if (!password_confirmation){
      return res.render('users/new', {
        alert: {
          msg: "Senhas devem ser iguais",
          type: "danger"
        },
        cities  
      })
    }

    // create a transaction
    let transaction = await db.transaction();

    // persist data
    try {
      // create a new client
      const client = await Client.create({
        name,
        email,
        mobile,
        zipcode,
        address,
        password,
        created_at: new Date(),
        updated_at: new Date(),
        neighborhood_id
      },{transaction});

      // if everything worked as planned -- commit the changes
      await transaction.commit();
      
      // generate a uuid
      const uuid = uuid_generate(client);

      // create a session
      req.session.client = {
        id: client.id,
        name: client.name,
        email: client.email,
        username: client.username,
        uuid: uuid 
      }
      return res.redirect(`/users/${uuid}/admin`); 

    } catch(err) {
      await transaction.rollback();
      console.log("Houve um erro ao gerar o registro. Tente novamente!");
      console.log(err);
      return res.render('users/new', {
        alert: {
          msg: "Houve um erro ao gerar o registro. Tente novamente!",
          type: "danger"
        },
        err,
        cities  
      })
    }
  },

  edit: (req,res) => {
    res.render('users/edit');
  }
}

// helper functions

const uuid_generate = function (client) {
  return `${client.id}-${client.name.toLowerCase().replace(/\s+/g, '-')}`
}

const uuid_unmount = function (uuid){
  let [id, ...name] = uuid.split("-");
  name = name.join(" ");
  return {
    id,
    name
  }
}

const get_all_states = async function (){
  return await State.findAll({
    include: {
      model: City,
      require: true,
      include: {
        model: Neighborhood,
        require: true
      }
    }
  });
}

module.exports = controller;