const { Service } = require('../../../models');

const controller = {
  index: async (_req,res) => {
    try {
      const services = await Service.findAll();
      return res.status(200).json(services);
    } catch(error) {
      return res.status(400).json({
        error: true,
        msg: "Houve um erro ao consultar banco da dados."
      })
    } 
  }
}

module.exports = controller;