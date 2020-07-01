// import some sequelize models
const { Newsletter } = require('../models/index');

const controller = {
  create: async (req, res) => {
    let {email} = req.params;
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if(emailRegexp.test(email)){
      try{
        // check if it's a duplicate account
        let duplicate = await Newsletter.findOne({
          where: {
            email
          }
        });

        if(duplicate){
          req.flash('success', `Seu e-mail já pertence a nossa base! Continue recebendo todas as novidades e promoções!`);
          return res.status(201).json({
            error: false,
            msg: 'E-mail adicionado com sucesso!'
          });
        }
        
        // it's not duplicate
        let newEmail = await Newsletter.create({
          email,
          created_at: new Date()
        });  
        req.flash('success', `Parabéns! A partir deste momento, você passará a receber todas as novidades e promoções diretamente no seu e-mail!`);
        return res.status(201).json({
          error: false,
          msg: 'E-mail adicionado com sucesso!'
        });
      } catch {
        req.flash('error', `Houve um erro no processamento das informações! Tente novamente mais tarde.`);
        return res.status(400).json({
          error: true,
          msg: 'Houve um erro no processamento!'
        });
      }
    } else {
      req.flash('error', 'Infelizmente não pudemos adicionar seu e-mail a nossa newsletter! Verifique o e-mail e tente novamente.');
      return res.status(400).json({
        error: true,
        msg: 'Houve um erro ao adicionar e-mail!'
      });
    } 
  }
}

module.exports = controller;