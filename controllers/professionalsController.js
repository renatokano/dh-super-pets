const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.json')[env];
const db = new Sequelize(config);
const { Professional, Service, ProfessionalService, Neighborhood, City, State, CoverageArea, AvailableSlot, sequelize } = require('../models/index');
const bcrypt = require('bcrypt');
const { saltRounds } = require('../config/bcrypt');

const controller = {
  show: (req,res)=>{
    res.render('professionals/show');
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
  index: async (req, res) => {
    
    res.render('professionals/index');
  }
}

const uuidGenerate = function (professional) {
  return `${professional.id}-${professional.name.toLowerCase().replace(/\s+/g, '-')}`
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

module.exports = controller;