const { 
  PetType,
  Service, 
  Neighborhood,
  City
  } = require('../models/index');
const moment = require('../config/moment');

module.exports = async (_req, res, next) => {
  // services
  res.locals.input_services = await getAllServices();
  // neighborhoods
  res.locals.input_neighborhoods = await getAllNeighboords();
  // cities
  res.locals.input_cities = await getAllCities();
  // date_range
  res.locals.input_date_range = getDateRange();
  // pet_types
  res.locals.input_pet_types = await getAllPetTypes();
  next();
}

const getAllNeighboords = async function (){
  return await Neighborhood.findAll(
    { 
      raw: true,
      order: [
        ['name', 'ASC']
      ]
    }
  );
}

const getAllCities = async function (){
  return await City.findAll(
    { 
      raw: true,
      order: [
        ['name', 'ASC']
      ]
    }
  );
}

const getAllServices = async function (){
  return await Service.findAll(
    {
      raw: true,
      order: [
        ['name', 'ASC']
      ]
    }
  );
}

const getAllPetTypes = async function (){
  return await PetType.findAll(
    {
      raw: true,
      order: [
        ['id', 'ASC']
      ]
    }
  );
}

const getDateRange = function(days=7){
  let currentDate = new Date();
  let dateRange = [];

  for(let i=0; i<days; i++){
    currentDate = moment(currentDate).add(1, 'days');
    dateRange.push([
      moment(currentDate).format('YYYY-MM-DD').toString(),
      moment(currentDate).format('DD/MM/YYYY').toString()
    ]);
  }
  return dateRange;
}