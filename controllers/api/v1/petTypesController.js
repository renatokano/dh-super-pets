const {PetType} = require('../../../models');
const controller = {
  index: async (_req, res) => {
    try{
      const petTypes = await PetType.findAll();
      res.status(200).json(petTypes);
    } catch {
      res.status(400).json({
        error: true,
        msg: "Houve um erro ao acessar o banco de dados"
      })
    }
  }
}

module.exports = controller;