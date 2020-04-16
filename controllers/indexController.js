const controller = {
  index: (req,res) => {
    res.render('home/index');
  },
  termsOfUse: (req,res) => {
    res.render('home/terms-of-use');
  },
  faq: (req,res) => {
    res.render('home/faq');
  },
  aboutUs: (req,res) => {
    res.render('home/about-us');
  }
}

module.exports = controller;