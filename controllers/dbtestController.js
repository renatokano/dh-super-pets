const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.json')[env];
// create a connection w/ the database
const db = new Sequelize(config);
// import some sequelize models
const { Neighborhood, City, State } = require('../models/index');


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
  }
}

module.exports = controller;