const Sequelize = require('sequelize');
// env ~> our environment (production or development)
const env = process.env.NODE_ENV || 'development';
// based on our environment, get the correct db configuration file
const config = require(__dirname + '/../config/database.js')[env];
// create a connection w/ the database
const db = new Sequelize(config);
const { Professional, AvailableSlot } = require('../models/index');
const moment = require('../config/moment');

const controller = {

    create: async (req, res) => {
        const { slots } = req.body;
        let { id: uuid } = req.params;
        let { id } = uuidUnmount(uuid);

        const professional = await Professional.findByPk(id);

        if (!professional){
            req.flash('error', 'Acesso negado!');
            return res.redirect('/');
          }

        let allSlots = [];
        vectorSlots = slots.split(",");

        for (let i=0; i<vectorSlots.length; i++) {
            // transforma moment time format to native date format
            console.log(vectorSlots[i]);
            let start_time = new Date(vectorSlots[i]);
            console.log(start_time);

            let slotElement = {
                professional_id: id,
                start_time,
                status: 'A',
                created_at: new Date(),
                updated_at: new Date()
            }
            console.log(slotElement);
            allSlots.push(slotElement);
        }

        let transaction = await db.transaction();
        try {
            await AvailableSlot.bulkCreate(allSlots, {
                returning: true
            }, transaction);
            await transaction.commit();
            req.flash('success', 'Agenda atualizada com sucesso!');
            return res.redirect(`/professionals/${uuid}/admin`);
        } catch (error) {
            await transaction.rollback();
            console.log("Houve um erro ao gerar os slots. Tente novamente!");
            console.log(error);
            req.flash('error', 'Houve um erro no processamento das informações! Tente novamente mais tarde!');
            return res.redirect('/');
        }

    }

};

const uuidUnmount = function (uuid){
    let [id, ...name] = uuid.split("-");
    name = name.join(" ");
    return {
      id,
      name
    }
  }
  

module.exports = controller;