const { ProfessionalRating } = require('../models/index');

const controller = {
  'professionalRatings': async (req, res) => {
    const {...data} = req.query;
    const {id: client_id} = req.session.client;
    try {
      ProfessionalRating.create({
        rating: parseInt(data.rate),
        comment: data.comment,
        client_id,
        professional_id: parseInt(data.professionalId), 
        start_time: data.slotTime,
        created_at: new Date(),
        updated_at: new Date()
      });
      req.flash('success', 'Avaliação realizada com sucesso!');
      return res.status(200).json({
        error: false,
        msg: 'Avaliação realizada com sucesso!'
      });
    } catch {
      req.flash('error', 'Houve um durante o processamento da avaliação! Tente novamente mais tarde.');
      return res.status(400).json({
        error: true,
        msg: 'Houve um durante o processamento da avaliação! Tente novamente mais tarde.'
      });
    }
    
  }
}

module.exports = controller;