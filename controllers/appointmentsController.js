const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.js')[env];
const db = new Sequelize(config);
const { Appointment, AvailableSlot, ProfessionalService } = require('../models/index');

const controller = {
  create: async (req, res) => {
    // here, it need to be 2 transactions to prevent conflicts
    let transaction = await db.transaction();
    let transaction2 = await db.transaction();
    try {
      // get professional_id, time_slot and service_id
      let { professionalId:professional_id, timeSlot, serviceId:service_id } = req.params;
      // get the client_id by session (note: the user needs to be logged!)
      const { id:client_id } = req.session.client;

      // transforma moment time format to native date format
      let start_time = new Date(timeSlot);

      // check if the professional really have an available slot
      let availableSlot = await AvailableSlot.findOne({
        where: {
          professional_id,
          start_time,
          status: 'A'
        }
      },transaction);

      // check if timeSlot exists
      if(!availableSlot) throw new Error('Slot não existe!');
      
      // check if the slot is availaible
      if(availableSlot.status != 'A') throw new Error('Slot não disponível!');
      
      // update availableSlot status
      availableSlot.status = 'B'; // [A: Available, B: Booked]
      availableSlot.created_at = new Date();
      availableSlot.updated_at = new Date();
      await availableSlot.save({transaction});

      // get the price of the service
      let professionalService = await ProfessionalService.findOne({
        where: {
          professional_id,
          service_id
        }
      }, transaction);

      // execute the 1st transaction
      await transaction.commit();
      
      // check if the service is offered by the professional
      if(!professionalService) throw new Error('Serviço não oferecido por este profissional!');
      // get the price of the service
      let price = professionalService.price;

      // create a new appointment
      let appointmentStatus = 'B' // [A: Available, B: Booked]
      let appointment = await Appointment.create({
        client_id,
        service_id,
        professional_id,
        start_time,
        price,
        status: appointmentStatus,
        created_at: new Date(),
        updated_at: new Date(),
      }, transaction2);
      
      // execute the 2nd transaction
      await transaction2.commit();

      return res.status(201).json({
        error: false, 
        msg: "Agendamento realizado com sucesso!"
      });
    } catch(error) {
      // something is not great, rollback the 1st and 2nd transactions
      await transaction.rollback();
      await transaction2.rollback();
      // return the error
      return res.status(400).json({
        error,
        msg: "Houve um erro durante o agendamento"
      });
    }
  }
}

module.exports = controller;