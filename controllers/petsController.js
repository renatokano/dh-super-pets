const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.json')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Pet, PetType } = require('../models/index');

const controller = {
  create: async (req, res) => {
    const {...data} = req.body;
    const {id: client_id, uuid} = req.session.client;
    data.client_id = client_id;

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
        weight: data.weight,
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
  }
}

module.exports = controller;