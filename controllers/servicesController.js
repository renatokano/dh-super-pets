const controller = {
  index: (req,res) => {
    res.render('services/index');
  },
  dogGrooming: (req,res) => {
    res.render('services/dog-grooming');
  },
  dogWalking: (req,res) => {
    res.render('services/dog-walking');
  },
  petBaths: (req,res) => {
    res.render('services/pet-baths');
  },
  petSitting: (req,res) => {
    res.render('services/pet-sitting');
  },
  petTraining: (req,res) => {
    res.render('services/pet-training');
  }
}

module.exports = controller;