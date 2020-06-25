const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.js')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Pet, PetType, Client } = require('../models/index');

const cloudinary = require('../config/cloudinary');

const controller = {
  create: async (req, res) => {
    // check if user is logged
    if(!req.session.client) {
      req.flash('error', 'É necessário que esteja logado para continuar!');
      return res.redirect(`/users/login`); 
    }

    const {...data} = req.body;
    const {id: client_id, uuid} = req.session.client;
    data.client_id = client_id;
    let [file] = req.files;

    // check if the photo was sent, else set default
    if (!file) {
      photo = 'https://res.cloudinary.com/superpets/image/upload/v1592952182/pets/800x500_c1pdhr.jpg';
    } else {
      // upload file to cloudinary
      const photoFile = await cloudinary.v2.uploader.upload(
        file.path,
        {
          tags: 'pets',
          folder: 'pets',
          allowedFormats: ["jpg", "png", "jpeg", "svg"],
          transformation: [{ width: 800, height: 500, crop: "limit" }]
        }
      );

      if(!photoFile){
        req.flash('error', 'Houve um erro ao enviar o arquivo! Tente novamente mais tarde.');
        return res.redirect(`/users/${uuid}/admin`); 
      }
      // get cloudinary photo url
      photo = photoFile.secure_url;
    } 

    // duplicate is not allowed
    const isDuplicate = await Pet.findOne({
      where: {
        name: data.name,
        client_id: data.client_id
      }
    });

    if(isDuplicate) {
      req.flash('error', 'Pet já cadastrado! Caso tenha outro pet, utilize outro nome.');
      return res.redirect(`/users/${uuid}/admin`);
    }

    // create a transaction
    let transaction = await db.transaction();

    // persist data
    try {
      const pet = await Pet.create({
        name: data.name,
        birth: data.birth,
        breed: data.breed,
        vaccinated: data.vaccinated == "on" ? 1 : 0,
        castrated: data.castrated == "on" ? 1 : 0,
        notes: data.notes,
        photo,
        pet_type_id: data.pet_type_id,
        client_id: data.client_id,
        created_at: new Date(),
        updated_at: new Date()
      },{transaction});
      await transaction.commit();
      // success
      req.flash('success', `Pet ${data.name} cadastrado com sucesso!`);
      return res.redirect(`/users/${uuid}/admin`);

    } catch (error) {
      await transaction.rollback();
      req.flash('error', 'Houve um erro no processamento. Tente novamente mais tarde!');
      return res.redirect('/');
    }
  },
  show: async (req, res) => {
    try{
      const { id } = req.session.client;
      
      const user = await Client.findByPk(id,{
        attributes: ['id', 'name'],
        include: [{
          model: Pet,
          require: false
        }]
      });

      res.send(JSON.stringify(user));
    } catch (error) {
      res.send(`Error:`, error);
    }
  },
  put: async (req, res) => {
    const {...data} = req.body;
    const {id, uuid} = req.session.client;
    let [file] = req.files;

    const pet = await Pet.findByPk(data.editMyPets__id);
    
    // is the pet owner?
    if (pet.client_id != id){
      req.flash('error', 'Acesso negado! Você deve ser dono desse pet para realizar modificações.');
      return res.redirect('/');
    }

    // have a new image
    if(typeof(file) == 'undefined') {
      photo = pet.photo;
    } else {
      // upload file to cloudinary
      const photoFile = await cloudinary.v2.uploader.upload(
        file.path,
        {
          tags: 'pets',
          folder: 'pets',
          allowedFormats: ["jpg", "png", "jpeg", "svg"],
          transformation: [{ width: 800, height: 500, crop: "limit" }]
        });
      if(!photoFile){
        req.flash('error', 'Houve um erro ao enviar o arquivo! Tente novamente mais tarde.');
        return res.redirect(`/users/${uuid}/admin`); 
      }
      // get cloudinary photo url
      photo = photoFile.secure_url;
    };
    
    // pet data update
    let transaction = await db.transaction();
    try {
      await Pet.update({
        name: data.editMyPets__name,
        breed: data.editMyPets__breed,
        castrated: data.editMyPets__castrated == 'on' ? 1 : 0,
        vaccinated: data.editMyPets__vaccinated == 'on' ? 1 : 0,
        notes: data.editMyPets__notes,
        birth: data.editMyPets__birth,
        photo,
        pet_type_id: data.editMyPets__pet_type_id,
        updated_at: new Date()
      },{
        where: {
          id: data.editMyPets__id
        },
      },{
        transaction
      });
      await transaction.commit();
      req.flash('success', `Pet modificado com sucesso!`);
      return res.redirect(`/users/${uuid}/admin`);
    } catch(error) {
      await transaction.rollback();
      req.flash('error', 'Houve um erro no processamento. Tente novamente mais tarde!');
      return res.redirect('/');
    }
  }
}

module.exports = controller;