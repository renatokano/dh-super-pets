const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.js')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { CoverageArea } = require('../models/index');

const controller = {
  create: async (req, res) => {
    const {...data} = req.body;
    const {id: professional_id, uuid} = req.session.professional;
    data.professional_id = professional_id;

    let transaction = await db.transaction();

    try {
      const coverageAreas = await CoverageArea.create({
        professional_id: data.professional_id,
        neighborhood_id: data.district,
        created_at: new Date(),
        updated_at: new Date()
      },{transaction});
      await transaction.commit();
      // create a success flash message
      req.flash('success', 'Nova área de cobertura adicionada com sucesso!');
      return res.redirect(`/professionals/${uuid}/admin`);

    } catch (error) {
      await transaction.rollback();
      req.flash('error', 'Houve um erro no processamento! Tente novamente');
      return res.redirect(`/`); 
    }
  },

  delete: async(req, res) => {
    const {...data} = req.body;
    const {id: professional_id, uuid} = req.session.professional;
    data.professional_id = professional_id;
    const { idP } = req.params;

    let transaction = await db.transaction();

    try {
      await CoverageArea.destroy({
        where: {
          professional_id: data.professional_id,
          neighborhood_id: idP
        }
      }, {transaction});

      await transaction.commit();
      req.flash('success', 'Área de cobertura removida com sucesso!');
      return res.redirect(`/professionals/${uuid}/admin`);

    } catch (error) {
      await transaction.rollback();
      req.flash('error', 'Houve um erro no processamento! Tente novamente');
      return res.redirect(`/`); 
    }

  }
}

module.exports = controller;