const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.js')[env];
const db = new Sequelize(config);
const { PetType, Professional, Service, ProfessionalService, ProfessionalRating, Neighborhood, City, State, CoverageArea, AvailableSlot, sequelize } = require('../models/index');
const bcrypt = require('bcrypt');
const { saltRounds } = require('../config/bcrypt');
const moment = require('../config/moment');

const controller = {
  show: async (req,res)=>{
    try {
      // get the uuid
      let {id: uuid} = req.params;
      // uuid -> id
      let {id} = uuidUnmount(uuid);

      // get more info about the professional
      const professional = await Professional.findByPk(id,{
        attributes: [
          'id', 'name', 'about_me', 'photo', 'created_at',
        ],
        include: [{
          model: Neighborhood,
          as: "coverage_areas",
          require: false,
          attributes: [
            'name'
          ]
        },
        {
          model: Service,
          require: false,
        }],
        order: [
          [Service,'name', 'ASC'],
        ]
      });

      // get the average/count rating
      let ratings = await ProfessionalRating.findAll({
        where: {
          professional_id: id
        },
        group: ['professional_id'],
        attributes: [
          'professional_id', 
          [sequelize.fn('avg', sequelize.col('rating')), 'average_rating'],
          [sequelize.fn('count', sequelize.col('id')), 'count_rating']
        ]
      });

      // get all comments
      let comments = await ProfessionalRating.findAll({
        where: {
          professional_id: id
        },
        attributes: ['comment']
      });

      // get the available slots
      let days = 6; // default: 6 days
      // get the limits
      let {tomorrow, lastDay} = getDate(days);


      // get all slots between tomorrow and lastDay
      let slots = await AvailableSlot.findAll({
        where:{
          professional_id: id,
          start_time: {
            [Sequelize.Op.between]: [tomorrow, lastDay]
          },
          status: 'A' // get all available slots (note: Just A: Available)
        }
      });

      // all is ok, just return the data
      return res.render('professionals/show', {
        slots,
        comments,
        ratings,
        professional,
        tomorrow,
        lastDay,
        moment
      });
    } catch {
      // some problem here, redirect to the home
      return res.redirect('/');
    }    
  },
  admin: async (req,res) => {
     const { id: uuid } = req.params;

     const {
      id: professional_id,
      name: professional_name,
      email: professional_email,
      uuid: professional_uuid
    } = req.session.professional;

    const states = await getAllStates();
    const neighborhoods = await getAllNeighboords();
    const services = await getAllServices();

    const professional = await Professional.findByPk(professional_id, {
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
        model: Service,
        require: false
      },
      {
        model: Neighborhood,
        as: "coverage_areas",
        require: false
      },
    ]
    });
    if (!professional || professional_uuid != uuid){
      return res.render('home/index',{
        alert: {
          msg: "Usuário inválido",
          type: "danger"
        }
      });
    }

    return res.render('professionals/admin', {
      professional,
      states,
      neighborhoods,
      services
    });
    
  },
  new: async (req,res)=>{
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
    return res.render('professionals/new', {
      cities
    });
  },
  create: async (req, res) => {
    let { name, email, mobile, neighborhood, password, confirm_password, agree_terms_of_service,
      adestramento, banho, dogsitter, dogwalking, tosa } = req.body;

    // password hash
    password = await bcrypt.hash(password, saltRounds);
    const password_confirmation = await bcrypt.compare(confirm_password, password);

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
    if (agree_terms_of_service !== "on"){
      return res.render('professionals/new', {
        alert: {
          msg: "É necessário que leia e aceite os termos de serviço",
          type: "danger"
        },
        cities  
      })
    }
    if (!password_confirmation){
      return res.render('professionals/new', {
        alert: {
          msg: "Senhas devem ser iguais",
          type: "danger"
        },
        cities  
      })
    }

    let transaction = await db.transaction();

    try {
      // create a new professional
      const professional = await Professional.create({
        name,
        email,
        mobile,
        neighborhood_id: neighborhood,
        password,
        created_at: new Date(),
        updated_at: new Date(),
      }, {transaction});

      await transaction.commit();

      const uuid = uuidGenerate(professional);
 
      /* professionals-services */
      let services = [];
      
      if (adestramento === "on") {
        services.push('Adestramento');
      }

      if (banho === "on") {
        services.push('Banho');
      }

      if (dogsitter === "on") {
        services.push('Pet Sitting');
      }

      if (dogwalking === "on") {
        services.push('Dog Walking');
      }

      if (tosa === "on") {
        services.push('Tosa');
      }

      const Op = Sequelize.Op;
      const ids = await Service.findAll({
        attributes: ['id'],
        where: {
          name: {
            [Op.in]: [services]
          }
        }
      });

      for (let i=0; i<ids.length; i++) {
        let service_id = ids[i].id;
        await ProfessionalService.create({
          professional_id: professional.id,
          service_id
        });
      }

      req.session.professional = {
        id: professional.id,
        name: professional.name,
        email: professional.email,
        uuid: uuid
      }

     return res.redirect(`/professionals/${uuid}/admin`); 

    } catch(err) {
      console.log("Houve um erro ao gerar o registro. Tente novamente!");
      console.log(err);
      return res.render('professionals/new', {
        alert: {
          msg: "Houve um erro ao gerar o registro. Tente novamente!",
          type: "danger"
        },
        err,
        cities  
      })
    }
  },
  put: async (req, res)=>{

    const {...data} = req.body;
    const {id, uuid} = req.session.professional;
    let [file] = req.files;

    const professional = await Professional.findByPk(id);

    /* PASSWORD */
    if(typeof(data.new_password) != 'undefined'){

      const new_password = await bcrypt.hash(data.new_password, saltRounds);
      
      const password_confirmation = await bcrypt.compare(data.old_password, professional.password);
      const new_password_confirmation = await bcrypt.compare(data.confirm_new_password, new_password);
      if(!password_confirmation || !new_password_confirmation) return res.redirect(`/professionals/${uuid}/admin`);

      let newPasswordTransaction = await db.transaction();
      try {
        Professional.update({
          password: new_password,
          updated_at: new Date()
        },{
          where:{id},
          newPasswordTransaction
        });
        await newPasswordTransaction.commit();
        return res.redirect(`/professionals/${uuid}/admin`);
      } catch (error) {
        await newPasswordTransaction.rollback();
        console.log("Houve um erro ao gerar o registro. Tente novamente!");
        console.log(error);
        res.render('home/index');
      }
    }
    /* fim PASSWORD */

    /* IMAGE */
    if(typeof(file) == 'undefined') {
      photo = professional.photo;
    } else {
      photo = file.filename;
    };
    /** fim IMAGE */

    /* DATA PROFESSIONAL */
    let transaction = await db.transaction();
    try {
      await Professional.update({
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
      return res.redirect(`/professionals/${uuid}/admin`);

    } catch (error) {
      await transaction.rollback();
      console.log("Houve um erro ao gerar o registro. Tente novamente!");
      console.log(error);
      res.render('home/index');
    }
  },
  search: async (req, res) => {
    let {services: professionalServiceId, neighborhood: neighborhoodId, date: dateToServiceId} = req.query;

    professionalServiceId = professionalServiceId ? professionalServiceId : ''
    neighborhoodId = neighborhoodId ? neighborhoodId : ''
    dateToServiceId = dateToServiceId ? dateToServiceId : ''

    // pagination config
    let perPage = 5;
    let page = 10;

    // creating some filters based on user input
    let neighborhoodFilter = neighborhoodId ? `WHERE neighborhoods.id=${neighborhoodId}` : ''
    let professionalServiceFilter = professionalServiceId ? `WHERE services.id IN (${professionalServiceId})` : ''
    let dateToServiceFilter = dateToServiceId ? `WHERE start_time BETWEEN '${dateToServiceId} 00:00:00' AND '${dateToServiceId} 23:59:59'` : ''

    // subquery to get all professionals and group by professional.emails
    let neighborhoodQuery = `SELECT professionals.*, GROUP_CONCAT(neighborhoods.name) as neighborhood_names, GROUP_CONCAT(neighborhoods.id) as neighborhood_ids
      FROM professionals
      INNER JOIN coverage_areas ON coverage_areas.professional_id=professionals.id
      INNER JOIN neighborhoods ON neighborhoods.id=coverage_areas.neighborhood_id
      ${neighborhoodFilter}
      GROUP BY professionals.email`

    // subquery to filter professionals by services
    let professionalServicesQuery = `SELECT professionals.*
      FROM (${neighborhoodQuery}) AS professionals
      INNER JOIN professional_services ON professionals.id=professional_services.professional_id
      INNER JOIN services ON professional_services.service_id=services.id
      ${professionalServiceFilter}
      GROUP BY professionals.email`
    
    // subquery to get all professionals ratings
    let professionalRatings = `(SELECT professional_id, AVG(rating) AS stars, COUNT(rating) AS rating_amount
      FROM professional_ratings
      GROUP BY professional_id) as ratings`

    // subquery to get all available slots
    let availableSlots = `(SELECT professional_id, GROUP_CONCAT(start_time) AS slot_times, GROUP_CONCAT(status) AS slot_status
      FROM available_slots
      ${dateToServiceFilter}
      GROUP BY professional_id) as slots`

    // subquery to get all services offered
    let allServices = `(SELECT professional_id, GROUP_CONCAT(service_id) AS all_services_id, GROUP_CONCAT(name) AS all_services, GROUP_CONCAT(price) AS all_prices
    FROM professional_services
    INNER JOIN services
    ON professional_services.service_id = services.id
    GROUP BY professional_id) AS allServices`

    // subquery to get the coverage area
    let coverageArea = `(SELECT professional_id, GROUP_CONCAT(neighborhoods.id) AS neighborhood_ids, GROUP_CONCAT(name) AS all_neighborhoods
    FROM coverage_areas
    INNER JOIN neighborhoods
    ON coverage_areas.neighborhood_id = neighborhoods.id
    GROUP BY professional_id) AS coverageAreas`

    // query to get all professionals w/ all professional data, coverage area, services offered and professional ratings
    const professionals = await db.query(`SELECT professionals.*, ratings.*, slots.*, allServices.*, coverageAreas.*
      FROM (${professionalServicesQuery}) AS professionals
      LEFT OUTER JOIN ${professionalRatings}
      ON ratings.professional_id = professionals.id
      INNER JOIN ${availableSlots}
      ON slots.professional_id = professionals.id
      INNER JOIN ${allServices}
      ON allServices.professional_id = professionals.id
      INNER JOIN ${coverageArea}
      ON coverageAreas.professional_id = professionals.id
      `, {
      type: Sequelize.QueryTypes.SELECT
    });

    return res.json(professionals);
  },
  index: async (req, res) => {
    let {services: serviceIdFilter, neighborhood: neighborhoodIdFilter, date: dateFilter} = req.query;

    serviceIdFilter = serviceIdFilter ? serviceIdFilter : ''
    neighborhoodIdFilter = neighborhoodIdFilter ? neighborhoodIdFilter : ''
    dateFilter = dateFilter ? dateFilter : ''

    const neighborhoods = await getAllNeighboords();
    const services = await getAllServices();
    const petTypes = await getAllPetTypes();

    let currentDate = new Date();
    let dateRange = [];

    for(let i=0; i<7; i++){
      currentDate = moment(currentDate).add(1, 'days');
      dateRange.push([
        moment(currentDate).format('YYYY-MM-DD').toString(),
        moment(currentDate).format('DD/MM/YYYY').toString()
      ]);
    }

    //return res.send(dateRange);

    return res.render('professionals/index',{
      neighborhoods,
      services,
      petTypes,
      dateRange,
      serviceIdFilter,
      neighborhoodIdFilter,
      dateFilter,
      moment
    });
  }
}

// returns a literal object containing tomorrow (today+1) and the nth day
const getDate = function (days=6){
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0);
  tomorrow.setMinutes(0);
  tomorrow.setSeconds(0);
  tomorrow.setMilliseconds(0);

  let lastDay = new Date();
  lastDay.setDate(lastDay.getDate() + days);
  lastDay.setHours(23);
  lastDay.setMinutes(59);
  lastDay.setSeconds(59);
  lastDay.setMilliseconds(999);

  return {
    tomorrow,
    lastDay
  }
}

const uuidGenerate = function (professional) {
  return `${professional.id}-${professional.name.toLowerCase().replace(/\s+/g, '-')}`
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

const getAllNeighboords = async function (){
  return await Neighborhood.findAll(
    {
      order: [
        ['name', 'ASC']
      ]
    }
  );
}

const getAllServices = async function (){
  return await Service.findAll(
    {
      order: [
        ['name', 'ASC']
      ]
    }
  );
}

const getAllPetTypes = async function (){
  return await PetType.findAll(
    {
      order: [
        ['id', 'ASC']
      ]
    }
  );
}

module.exports = controller;