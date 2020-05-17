const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.json')[env];
const db = new Sequelize(config);

const controller = {
  dbconnection: async (req, res) => {
    try {
      await db.authenticate();
      res.send(`Connection has been established successfully.`);
    } catch (error) {
      res.send('Unable to connect to the database:', error);
    }
  },
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
  }
}

module.exports = controller;