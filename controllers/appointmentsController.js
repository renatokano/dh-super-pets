const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.js')[env];
const db = new Sequelize(config);
const { Appointment, AvailableSlot, ProfessionalService, Client, Professional } = require('../models/index');
const moment = require('../config/moment');
const sgMail = require('../config/sendgrid');

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

      // transform moment time format to native date format
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
      if(!availableSlot) {
        // create a error flash message
        req.flash('error', 'Este horário não está disponível na agenda do profissional!');
        return res.status(400).json({
          error: true,
          msg: "Slot não existe!"
        });
      };
      
      // check if the slot is availaible
      if(availableSlot.status != 'A') {
        req.flash('error', 'Este horário não está mais disponível na agenda do profissional! Selecione outro horario.');
        return res.status(400).json({
          error: true,
          msg: "Status do slot na agenda do profissional como indisponível"
        });
      }
      
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

      // check if the service is offered by the professional
      if(!professionalService) {
        req.flash('error', 'Este serviço não é oferecido por este profissional! Tente outra opção.');
        return res.status(400).json({
          error: true,
          msg: "Serviço não oferecido pelo profissional"
        });
      }

      // execute the 1st transaction
      await transaction.commit();
      
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

      // get the client (name, email)
      let client = await Client.findOne({
        where: {
          id: client_id
        },
        attributes: ['name', 'email', 'mobile']
      });

      // get the professional (name, email)
      let professional = await Professional.findOne({
        where: {
          id: professional_id
        },
        attributes: ['name', 'email', 'mobile']
      });

      // success
      req.flash('success', 'Parabéns, seu agendamento foi realizado com sucesso!');
      generateEmails(client, professional, appointment); // send emails to professional and client informs about the appointment
      return res.status(201).json({
        error: false, 
        msg: "Agendamento realizado com sucesso!"
      });
    } catch(error) {
      // something is not great, rollback the 1st and 2nd transactions
      await transaction.rollback();
      await transaction2.rollback();
      // return the error
      req.flash('error', 'Houve um erro durante o agendamento! Tente novamente.');
      return res.status(400).json({
        error: true,
        msg: "Houve um erro durante o agendamento"
      });
    }
  }
}

const generateEmails = async function(client, professional, appointment){

  // professional data
  let professional_html = '';
  let professional_text = '';
  let professional_subject = '';

  professional_html = `<strong>Olá ${professional.name}, temos uma ótima notícia para te dar!!!</strong>
    <br>
    <p>Um agendamento acabou de ser realizado pela SuperPets!!!</p>
    <br>
    <p>Segue abaixo os dados do seu cliente:</p>
    <p>Nome: ${client.name}</p>
    <p>E-mail: ${client.email}</p>
    <p>Celular: ${client.mobile}</p>
    <p>Horário: ${moment(appointment.start_time).format('DD/MM/YYYY HH:mm')}</p>
    <p>Utilize esses dados para se conectar ao seu cliente e combinar como será realizado o serviço.</p>
    <p>Lembre-se sempre de manter seus dados atualizados na nossa plataforma.
    <p>Em caso de dúvidas, nos contate por um dos nossos canais de contato.</p>
    <br>
    <p>Desejamos muito sucesso e ótimos negócios!</p>
    <p>Equipe SuperPets</p>
  `;

  professional_text = `Olá ${professional.name}, temos uma ótima notícia para te dar!!!\n\nUm agendamento acabou de ser realizado pela SuperPets!!!\nSegue abaixo os dados do seu cliente:\nNome: ${client.name}\nE-mail: ${client.email}\nCelular: ${client.mobile}\nHorário: ${moment(appointment.start_time).format('DD/MM/YYYY HH:mm')}\nUtilize esses dados para se conectar ao seu cliente e combinar como será realizado o serviço.\nLembre-se sempre de manter seus dados atualizados na nossa plataforma.\nEm caso de dúvidas, nos contate por um dos nossos canais de contato.\nDesejamos muito sucesso e ótimos negócios!\n\nEquipe SuperPets`;

  professional_subject = `Olá ${professional.name}, temos uma ótima notícia para te dar!!!`;

  // client data
  let client_html = '';
  let client_text = '';
  let client_subject = '';

  client_html = `<strong>Olá ${client.name}, temos uma ótima notícia para te dar!!!</strong>
  <br>
  <p>O seu agendamento foi realizado com sucesso e o profissional já foi contatado pela nossa plataforma!!!</p>
  <p>A partir deste momento, aguarde o contato do profissional para que possam combinar a execução do trabalho.</p>
  <br>
  <p>Enviamos abaixo os dados de contato do profissional escolhido:</p>
  <p>Nome: ${professional.name}</p>
  <p>E-mail: ${professional.email}</p>
  <p>Celular: ${professional.mobile}</p>
  <p>Horário: ${moment(appointment.start_time).format('DD/MM/YYYY HH:mm')}</p>
  <p>Utilize esses dados caso precise se comunicar com o profissional.</p>
  <p>Lembre-se sempre de manter seus dados atualizados na nossa plataforma.
  <p>Em caso de dúvidas, nos contate por um dos nossos canais de contato.</p>
  <br>
  <p>Desejamos uma maravilhosa experiência!!!</p>
  <p>Equipe SuperPets</p>
  `;

  client_text = `Olá ${client.name}, temos uma ótima notícia para te dar!!!\n\nO seu agendamento foi realizado com sucesso e o profissional já foi contatado pela nossa plataforma!!!\nA partir deste momento, aguarde o contato do profissional para que possam combinar a execução do trabalho.\nEnviamos abaixo os dados de contato do profissional escolhido:\nNome: ${professional.name}\nE-mail: ${professional.email}\nCelular: ${professional.mobile}\nHorário: ${moment(appointment.start_time).format('DD/MM/YYYY HH:mm')}\nUtilize esses dados caso precise se comunicar com o profissional.\nLembre-se sempre de manter seus dados atualizados na nossa plataforma.\nEm caso de dúvidas, nos contate por um dos nossos canais de contato.\nDesejamos uma maravilhosa experiência!!!\n\nEquipe SuperPets`;

  client_subject = `Olá ${client.name}, temos uma ótima notícia para te dar!!!`;

  try {
    let msg_professional = {
      to: `${professional.email}`,
      from: 'superpets.sp@gmail.com',
      subject: professional_subject,
      text: professional_text,
      html: professional_html
    }
    let msg_client = {
      to: `${client.email}`,
      from: 'superpets.sp@gmail.com',
      subject: client_subject,
      text: client_text,
      html: client_html
    }
    await sgMail.send(msg_professional);
    await sgMail.send(msg_client);
  } catch(error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  }
}

module.exports = controller;