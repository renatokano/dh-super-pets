const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.js')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Pet, PetType, Client } = require('../models/index');

const controller = {
  create: async (req, res) => {
    const {...data} = req.body;
    const {id: client_id, uuid} = req.session.client;
    data.client_id = client_id;
    let [file] = req.files;

    // duplicate is not permited
    const isDuplicate = await Pet.findOne({
      where: {
        name: data.name,
        client_id: data.client_id
      }
    });

    if(isDuplicate) {
      console.log("Pet já cadastrado.");
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
        photo: file.filename,
        pet_type_id: data.pet_type_id,
        client_id: data.client_id,
        created_at: new Date(),
        updated_at: new Date()
      },{transaction});
      await transaction.commit();
      return res.redirect(`/users/${uuid}/admin`);

    } catch (error) {
      await transaction.rollback();
      console.log("Houve um erro ao gerar o registro. Tente novamente!");
      console.log(error);
      res.render('home/index');
    }

    return res.send(data);
  },
  show: async (req, res) => {
    try{
      const { id } = req.session.client;
      console.log(`id=${id}`);
      
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
    if (pet.client_id != id) 
      return res.render('home/index');

    // have a new image
    if(typeof(file) == 'undefined') {
      photo = pet.photo;
    } else {
      photo = file.filename;
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
      return res.redirect(`/users/${uuid}/admin`);
    } catch(error) {
      await transaction.rollback();
      console.log("Houve um erro ao gerar o registro. Tente novamente!");
      console.log(error);
      return res.render('home/index');
    }
  }
}

module.exports = controller;