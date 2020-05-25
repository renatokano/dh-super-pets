const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.json')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Neighborhood, City, State, Client, Pet, PetType } = require('../models/index');
// hash/compare passwords
const bcrypt = require('bcrypt');
const { saltRounds } = require('../config/bcrypt');

const controller = {
  show: (req,res) => {
    res.render('users/show');
  },

  admin: async (req,res) => {
    const {id: uuid} = req.params;
    //const {id, name} = uuidUnmount(uuid);
    const {
      id: client_id,
      name: client_name,
      email: client_email,
      uuid: client_uuid
    } = req.session.client;
  
    // get state/city/neighborhood fields
    const states = await getAllStates();
    // get pettype field
    const petTypes = await getAllPetTypes();
    
    // validation
    const user = await Client.findByPk(client_id,{
      include: [{
        model: Neighborhood,
        required: true,
        include: {
          model: City,
          required: true,
          include: {
            model: State,
            required: true
          }
        }
      },
      {
        model: Pet,
        require: false,
        include: {
          model: PetType,
          require: true
        }
      }]
    });
    if (!user || client_uuid != uuid){
      return res.render('home/index',{
        alert: {
          msg: "Usuário inválido",
          type: "danger"
        }
      });
    }
    return res.render('users/admin', {
      user,
      states,
      petTypes
    });
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
      const uuid = uuidGenerate(client);

      // create a session
      req.session.client = {
        id: client.id,
        name: client.name,
        email: client.email,
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

  put: async (req,res) => {
    const {...data} = req.body;
    const {id, uuid} = req.session.client;
    let [file] = req.files;

    const client = await Client.findByPk(id);

    // only change password
    if(typeof(data.new_password) != 'undefined'){
      // password hash
      const new_password = await bcrypt.hash(data.new_password, saltRounds);
      
      // validation
      const password_confirmation = await bcrypt.compare(data.old_password, client.password);
      const new_password_confirmation = await bcrypt.compare(data.confirm_new_password, new_password);
      if(!password_confirmation || !new_password_confirmation) return res.redirect(`/users/${uuid}/admin`);

      let newPasswordTransaction = await db.transaction();
      try {
        Client.update({
          password: new_password,
          updated_at: new Date()
        },{
          where:{id},
          newPasswordTransaction
        });
        await newPasswordTransaction.commit();
        return res.redirect(`/users/${uuid}/admin`);
      } catch (error) {
        await newPasswordTransaction.rollback();
        console.log("Houve um erro ao gerar o registro. Tente novamente!");
        console.log(error);
        res.render('home/index');
      }
    }

    // have an image
    if(typeof(file) == 'undefined') {
      photo = client.photo;
    } else {
      photo = file.filename;
    };

    // client data update
    let transaction = await db.transaction();
    try {
      await Client.update({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        zipcode: data.zipcode,
        address: data.address,
        neighborhood_id: data.neighborhood_id,
        about_me: data.about_me,
        photo,
        updated_at: new Date()
      },{
        where: {
          id
        },
        transaction
      });
      await transaction.commit();
      return res.redirect(`/users/${uuid}/admin`);

    } catch (error) {
      await transaction.rollback();
      console.log("Houve um erro ao gerar o registro. Tente novamente!");
      console.log(error);
      res.render('home/index');
    }
    
    console.log(data);

    res.send(data);
  }
}

// helper functions

const uuidGenerate = function (client) {
  return `${client.id}-${client.name.toLowerCase().replace(/\s+/g, '-')}`
}

const uuidUnmount = function (uuid){
  let [id, ...name] = uuid.split("-");
  name = name.join(" ");
  return {
    id,
    name
  }
}

const getAllStates = async function (){
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

const getAllPetTypes = async function (){
  return await PetType.findAll();
}

module.exports = controller;