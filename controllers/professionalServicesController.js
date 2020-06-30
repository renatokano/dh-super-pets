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

    if(!data.services){
      // create a error flash message
      req.flash('error', 'O campo "serviços" é obrigatório!');
      return res.redirect(`/professionals/${uuid}/admin`); 
    }

    if(!data.price){
      // create a error flash message
      req.flash('error', 'O campo "preço" é obrigatório!');
      return res.redirect(`/professionals/${uuid}/admin`); 
    }

    let transaction = await db.transaction();

    try {
      const services = await ProfessionalService.create({
        professional_id: data.professional_id,
        service_id: data.services,
        price: data.price,
        created_at: new Date(),
        updated_at: new Date()
      },{transaction});
      await transaction.commit();
      // success
      req.flash('success', 'Novo serviço adicionado com sucesso!');
      return res.redirect(`/professionals/${uuid}/admin`);
    } catch (error) {
      await transaction.rollback();
      // error
      req.flash('error', 'Houve um erro no processamento! Tente novamente');
      return res.redirect(`/`); 
    }
  },

  delete: async(req, res) => {
    const {...data} = req.body;
    const {id: professional_id, uuid} = req.session.professional;
    data.professional_id = professional_id;
    const { idS } = req.params;

    const appointments = await db.query(
      `SELECT count(*) as qtd FROM appointments
      WHERE professional_id = ${data.professional_id} AND service_id = ${idS}`, {
        type: Sequelize.QueryTypes.SELECT
      });

    if (appointments[0].qtd > 0) {
      req.flash('error', 'O serviço não pode ser excluído!');
      return res.redirect(`/professionals/${uuid}/admin`); 
    }

    let transaction = await db.transaction();

    try {
      await ProfessionalService.destroy({
        where: {
            professional_id: data.professional_id,
            service_id: idS
        }
      }, {transaction});

      await transaction.commit();
      // success
      req.flash('success', 'Serviço removido com sucesso!');
      return res.redirect(`/professionals/${uuid}/admin`);

    } catch (error) {
      await transaction.rollback();
      // error
      req.flash('error', 'Houve um erro no processamento! Tente novamente');
      return res.redirect(`/`); 
    }

  }
}

module.exports = controller;