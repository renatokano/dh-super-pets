const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.js')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { ProfessionalService, Service } = require('../models/index');

const controller = {
  create: async (req, res) => {
    const {...data} = req.body;
    const {id: professional_id, uuid} = req.session.professional;
    data.professional_id = professional_id;

    let transaction = await db.transaction();

    try {
      const services = await ProfessionalService.create({
        professional_id: data.professional_id,
        service_id: data.services,
        created_at: new Date(),
        updated_at: new Date()
      },{transaction});
      await transaction.commit();
      return res.redirect(`/professionals/${uuid}/admin`);

    } catch (error) {
      await transaction.rollback();
      console.log("Houve um erro ao gerar o registro. Tente novamente!");
      console.log(error);
      res.render('home/index');
    }
  },

  delete: async(req, res) => {
    const {...data} = req.body;
    const {id: professional_id, uuid} = req.session.professional;
    data.professional_id = professional_id;
    const { idS } = req.params;

    let transaction = await db.transaction();

    try {
      await ProfessionalService.destroy({
        where: {
            professional_id: data.professional_id,
            service_id: idS
        }
      }, {transaction});

      await transaction.commit();
      return res.redirect(`/professionals/${uuid}/admin`);

    } catch (error) {
      await transaction.rollback();
      console.log("Houve um erro ao gerar o registro. Tente novamente!");
      console.log(error);
      res.render('home/index');
    }

  }
}

module.exports = controller;