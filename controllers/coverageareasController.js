const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.json')[env];
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