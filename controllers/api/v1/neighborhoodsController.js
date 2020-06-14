const { Neighborhood } = require('../../../models')
const controller = {
  index: async (_req, res) => {
    try {
      const neighborhoods = await Neighborhood.findAll();
      res.status(200).json(neighborhoods);
    } catch(error) {
      res.status(400).json({
        error: true,
        msg: "Houve um erro ao acessar o banco de dados"
      });
    }
  }
}

module.exports = controller;