const  moment = require('moment');

// moment configuration
moment.tz.setDefault('America/Sao_Paulo');
moment.locale('pt-BR');

module.exports = moment;


