const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.js')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Neighborhood, City, State, Client, PetType, Pet, Professional, ProfessionalService, Service, CoverageArea, AvailableSlot, Appointment, ClientRating, ProfessionalRating } = require('../models/index');
// generate fake data
const faker = require('faker');
faker.locale = "pt_BR";

// define our controller
const controller = {

  /****************************************************************
   *    DATABASE CONNECTION TEST
   *    e.g. http://localhost:3000/dbtest/
  ****************************************************************/
  dbconnection: async (req, res) => {
    try {
      await db.authenticate();
      res.send(`Connection has been established successfully.`);
    } catch (error) {
      res.send('Unable to connect to the database:', error);
    }
  },

  /****************************************************************
   *    GENERATE NEW DATA
  ****************************************************************/

  // create new client
  create_new_client: async (req,res) => {
    const neighborhood = await Neighborhood.findOne({
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

  // create a new pet to a specific client
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
    switch(pet_type.name){
      case 'Cãozinho (11-20kg)':
        weight = faker.random.number({min:11, max:20});    
        break;
      case 'Cãozinho (21-40kg)':
        weight = faker.random.number({min:21, max:40});
        break;
      case 'Cãozinho (+41kg)':
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

  // create_new_professional
  create_new_professional: async (req, res) => {
    const neighborhood = await Neighborhood.findOne({
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

    const professional = await Professional.create({
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

    return res.send(professional);
  },

  // create_new_area
  create_new_area: async (req, res) => {
    const {id: professional_id} = req.params;
    const {id: neighborhood_id} = await Neighborhood.findOne({
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

    const isDuplicate = await CoverageArea.findOne({
      where: {
        professional_id,
        neighborhood_id
      }
    });
    if (!isDuplicate) {
      const area = await CoverageArea.create({
        professional_id,
        neighborhood_id,
        created_at: new Date(),
        updated_at: new Date()
      });
      return res.send(area);
    }
    res.send('Already registered!');
  },

  create_new_appointment: async (req, res) => {
    const {id1: professional_id, id2: client_id} = req.params;
    let start_time = new Date();
    let hour = faker.random.number({min:8, max:18});
    start_time.setHours(hour, 0, 0);
    let status = "C"
    let rating1 = faker.random.number({min:2, max:5});
    let rating2 = faker.random.number({min:2, max:5});

    let service = await ProfessionalService.findOne({
      where: {
        professional_id
      }
    });

    await AvailableSlot.create({
      professional_id,
      start_time,
      status
    });

    await Appointment.create({
      client_id,
      professional_id,
      start_time,
      status,
      price: service.price,
      service_id: service.service_id
    });

    const clientRating = await ClientRating.create({
      rating: rating1,
      client_id,
      start_time,
      professional_id
    });

    const professionalRating = await ProfessionalRating.create({
      rating: rating2,
      comment: faker.lorem.paragraph(1),
      client_id,
      start_time,
      professional_id
    });

    res.json({
      clientRating
    });
  },

  // create_new_professional_service
  create_new_professional_service: async (req, res) => {
    const {id: professional_id} = req.params;
    const {id: service_id} = await Service.findOne({
      where: {
        name: faker.random.arrayElement([
          'Adestramento',
          'Banho',
          'Pet Sitting',
          'Dog Walking',
          'Tosa'
        ])
      }
    });
    const price = faker.random.number({min: 100, max: 400});
    const isDuplicate = await ProfessionalService.findOne({
      where: {
        professional_id,
        service_id
      }
    });
    if (!isDuplicate) {
      const professional_service = await ProfessionalService.create({
        professional_id,
        service_id,
        price, 
        created_at: new Date(),
        updated_at: new Date()
      });
      return res.send(professional_service);
    }
    return res.send("Already registered!")
  },

  /****************************************************************
   *    SELECT W/ JOINS
  ****************************************************************/

  // Clients -> Neighborhoods -> Cities -> States
  // Clients -> Pets -> PetTypes
  select_all_clients: async (req, res) => {
    const result = await Client.findAll({
      order: [
        ['name', 'ASC']
      ],
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
      },{
        model: Pet,
        required: false,
        include: {
          model: PetType,
          required: true
        }
      }]
    });
    return res.send(result);
  },

  // Clients(id) -> Neighborhoods -> Cities -> States
  // Clients(id) -> Pets -> PetTypes
  select_all_details_about_a_client: async (req, res) => {
    const {id: client_id} = req.params;
    const clients = await Client.findOne({
      where: {
        id: client_id
      },
      include: [{
        model: Neighborhood,
        required: true,
        include: [{
          model: City,
          required: true,
          include: [{
            model: State,
            required: true
          }]
        }]  
      },
      {
        model: Pet,
        required: false,
        include: [{
          model: PetType,
          required: true
        }]
      }]
    });
    return res.send(clients);
  },
  // Professionals -> Neighborhoods -> City -> State
  // Professionals -> CoverageAreas -> Neighborhoods -> City -> State
  // Professionals -> ProfessionalServices -> Services
  select_all_professionals: async (req, res) => {
    const professionals = await Professional.findAll({
      include: [{
        model: Neighborhood,
        require: true,
        include: {
          model: City,
          require: true,
          include: {
            model: State,
            require: true
          }
        }
      },
      {
        model: Neighborhood,
        require: false,
        as: "neighborhoods_list",
        include: {
          model: City,
          require: true,
          include: {
            model: State,
            require: true
          }
        }
      },
      {
        model: Service,
        require: false
      }]
    });
    return res.send(professionals);
  },

  /****************************************************************
   *    J/A SELECT W/ JOINS EXAMPLES USING RAW-QUERIES
  ****************************************************************/

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
  
  // Neighborhoods -> Cities -> States (raw-queries)
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
}

module.exports = controller;