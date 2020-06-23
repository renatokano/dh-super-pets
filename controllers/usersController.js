const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.js')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Neighborhood, City, State, Client, Pet, PetType } = require('../models/index');
// hash/compare passwords
const bcrypt = require('bcrypt');
const { saltRounds } = require('../config/bcrypt');

const  moment = require('moment');

const controller = {
  show: async (req,res) => {
    try {
      const {id: uuid} = req.params;
      const {id, name} = uuidUnmount(uuid);
      const user = await Client.findByPk(id,{
        include: [{
          model: Pet,
          require: false,
          include: {
            model: PetType,
            require: true
          }
        }]
      });

      if(!user){
        // create a error flash message
        req.flash('error', 'Usuário não existente. Tente novamente!');
        return res.redirect('/');
      }
      
      return res.render('users/show', {
        user,
        moment
      });
    } catch {
      // create a error flash message
      req.flash('error', 'Houve um erro na solicitação. Tente novamente mais tarde.');
      return res.redirect('/');
    }
  },

  admin: async (req,res) => {
    try {
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
        // create a error flash message
        req.flash('error', 'Acesso negado!');
        return res.redirect('/');
      }
      // success
      return res.render('users/admin', {
        user,
        states,
        petTypes
      });
    } catch {
      // create a error flash message
      req.flash('error', 'Houve um erro na solicitação. Tente novamente mais tarde.');
      return res.redirect('/');
    }
  },

  new: async (req,res) => {
    try {
      return res.render('users/new');
    } catch {
      // create a error flash message
      req.flash('error', 'Houve um erro na solicitação. Tente novamente mais tarde.');
      return res.redirect('/');
    }
  },

  create: async (req, res) => {
    let { name, email, mobile, zipcode, address, neighborhood_id, city_id, state, password, 
      confirm_password, agree_terms_of_service } = req.body;

    // check if name !== null
    if(!name){
      // create a error flash message
      req.flash('error', 'O campo "nome" é obrigatório!');
      return res.redirect('/users/new');
    }

    // check if email !== null
    if(!email){
      // create a error flash message
      req.flash('error', 'O campo "e-mail" é obrigatório!');
      return res.redirect('/users/new');
    }

    // check if mobile !== null
    if(!mobile){
      // create a error flash message
      req.flash('error', 'O campo "celular" é obrigatório!');
      return res.redirect('/users/new');
    }

    // check if zipcode !== null
    if(!zipcode){
      // create a error flash message
      req.flash('error', 'O campo "CEP" é obrigatório!');
      return res.redirect('/users/new');
    }

    // check if address !== null
    if(!address){
      // create a error flash message
      req.flash('error', 'O campo "Endereço" é obrigatório!');
      return res.redirect('/users/new');
    }

    // check if neighborhood_id !== null
    if(!neighborhood_id){
      // create a error flash message
      req.flash('error', 'O campo "Bairro" é obrigatório!');
      return res.redirect('/users/new');
    }

    // check if city_id !== null
    if(!city_id){
      // create a error flash message
      req.flash('error', 'O campo "Cidade" é obrigatório!');
      return res.redirect('/users/new');
    }

    // check if password !== null
    if(!password){
      // create a error flash message
      req.flash('error', 'A senha é obrigatória!');
      return res.redirect('/users/new');
    }

    // check if confirm_password !== null
    if(!confirm_password){
      // create a error flash message
      req.flash('error', 'O campo de confirmação de senha é obrigatório!');
      return res.redirect('/users/new');
    }

    // generate password hash
    password = await bcrypt.hash(password, saltRounds);
    const password_confirmation = await bcrypt.compare(confirm_password, password);

    // check if agree_terms_of_service is checked
    if (agree_terms_of_service !== "on"){
      // create a error flash message
      req.flash('error', 'É necessário que leia e aceite os termos de serviço!');
      return res.redirect('/users/new');
    }
    // check if passoword == password_confirmation
    if (!password_confirmation){
      // create a error flash message
      req.flash('error', 'É necessário que as senhas sejam iguais!');
      return res.redirect('/users/new');
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
      // success
      req.flash('success', `Seja bem vindo(a) ${name}! Conta criada com sucesso!`);
      return res.redirect(`/users/${uuid}/admin`); 

    } catch(err) {
      await transaction.rollback();
      req.flash('error', 'Houve um erro no processamento das informações! Tente novamente mais tarde!');
      return res.redirect('/users/new'); 
    }
  },

  put: async (req,res) => {
    const {...data} = req.body;
    const {id, uuid} = req.session.client;
    let [file] = req.files;

    // get the user
    const client = await Client.findByPk(id);

    // only change password
    if(typeof(data.new_password) != 'undefined'){
      if(!data.old_password || !data.new_password || !data.confirm_new_password){
        req.flash('error', 'Campos "Senha Atual", "Nova Senha" e "Confirme Senha" são necessários para modificar a sua senha! Tente novamente');
        return res.redirect(`/users/${uuid}/admin`); 
      }
      // password hash
      const new_password = await bcrypt.hash(data.new_password, saltRounds);
      
      // validation
      const password_confirmation = await bcrypt.compare(data.old_password, client.password);
      const new_password_confirmation = await bcrypt.compare(data.confirm_new_password, new_password);
      // check if new password == password_confirmation
      if(!password_confirmation || !new_password_confirmation) {
        req.flash('error', 'As senhas devem ser identicas! Tente novamente');
        return res.redirect(`/users/${uuid}/admin`); 
      }

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
        // success
        req.flash('success', 'Senha modificada com sucesso!');
        return res.redirect(`/users/${uuid}/admin`);
      } catch (error) {
        await newPasswordTransaction.rollback();
        req.flash('error', 'Houve um erro no processamento! Tente novamente');
        return res.redirect(`/users/${uuid}/admin`); 
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
      // success
      req.flash('success', 'Dados atualizados com sucesso!');
      return res.redirect(`/users/${uuid}/admin`);

    } catch (error) {
      await transaction.rollback();
      req.flash('error', 'Houve um erro no processamento das informações! Tente novamente mais tarde!');
      return res.redirect('/'); 
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