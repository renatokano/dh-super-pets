const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.json')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Neighborhood, City, State, Client, PetType, Pet } = require('../models/index');
// generate fake data
const faker = require('faker');
faker.locale = "pt_BR";

// define our controller
const controller = {
  // just a db authentication test
  dbconnection: async (req, res) => {
    try {
      await db.authenticate();
      res.send(`Connection has been established successfully.`);
    } catch (error) {
      res.send('Unable to connect to the database:', error);
    }
  },
  // a raw-query example
  select_all: async (req, res) => {
    const {entity} = req.params;
    try {
      const result = await db.query(`SELECT * FROM ${entity}`, {
        type: Sequelize.QueryTypes.SELECT
      });
      res.send(result);
    } catch (error) {
      res.send(`Error:`, error);
    }
  },
  // another raw-query example
  select_from_id: async (req, res) => {
    const {entity, id} = req.params;
    console.log(`SELECT * FROM ${entity} WHERE id=${id}`);
    try {
      const result = await db.query(`SELECT * FROM ${entity} WHERE id=${id}`, {
        type: Sequelize.QueryTypes.SELECT
      });
      res.send(result);
    } catch (error) {
      res.send(`Error:`, error);
    }
  },
  // an example using ORM (2 inner-joins)
  select_all_neighborhoods: async (req, res) => {
    const neighborhoods = await Neighborhood.findAll({
      order: [
        ['name', 'ASC']
      ],
      include: [{
        model: City,
        required: true,
        include: {
          model: State,
          required: true
        }
      }]
    });
    return res.send(neighborhoods);
  },

  // generate new client
  create_new_client: async (req,res) => {
    neighborhood = await Neighborhood.findOne({
      where: {
        name: faker.random.arrayElement([
          'Aclimação',
          'Itaim Bibi',
          'Moema',
          'Morumbi',
          'Pinheiros',
          'Pompéia',
          'Vila Madalena',
          'Vila Mariana',
          'Vila Olímpia'
        ])
      }
    });

    const new_client = await Client.create({
      name: faker.name.firstName() + " " + faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      mobile: faker.phone.phoneNumber("(11) 9####-####"),
      zipcode: faker.address.zipCode(),
      address: faker.address.streetSuffix() + ' ' + faker.address.streetName() + ', ' + faker.random.number(100),
      password: faker.random.alphaNumeric(6),
      about_me: faker.lorem.paragraph(1),
      created_at: new Date(),
      updated_at: new Date(),
      neighborhood_id: neighborhood.id
    });
    return res.send(new_client);
  },

  // generate a new pet to a specific client
  create_new_pet: async (req, res) => {
    const {id: client_id} = req.params;
    const pet_type = await PetType.findOne({
      where: {
        name: faker.random.arrayElement([
          'Cãozinho (0-10kg)',
          'Cãozinho (11-20kg)',
          'Cãozinho (21-40kg)',
          'Cãozinho (+41kg)',
          'Gatinho',          
        ])
      }
    });

    let weight;
    switch(pet_type.id){
      case 2:
        weight = faker.random.number({min:11, max:20});    
        break;
      case 3:
        weight = faker.random.number({min:21, max:40});
        break;
      case 4:
        weight = faker.random.number({min:41, max:100});
        break;
      default:
        weight = faker.random.number({min:0, max:10});
    }

    const new_pet = await Pet.create({
      name: faker.name.firstName(),
      weight,
      client_id,
      pet_type_id: pet_type.id,
      created_at: new Date(),
      updated_at: new Date()
    })
    return res.send(new_pet);
  },

  // get all pets from a specific client
  select_all_pets_from_a_client: async (req, res) => {
    const {id: client_id} = req.params;
    const clients = await Client.findOne({
      where: {
        id: client_id
      },
      include: [{
        model: Pet,
        required: false,
        include: [{
          model: PetType,
          required: true
        }]
      }]
    });
    return res.send(clients);
  }
}

module.exports = controller;