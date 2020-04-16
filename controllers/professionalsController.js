const controller = {
  index: (req,res)=>{
    res.render('professionals/index');
  }, 
  show: (req,res)=>{
    res.render('professionals/show');
  },
  admin: (req,res)=>{
    res.render('professionals/admin');
  },
  new: (req,res)=>{
    res.render('professionals/new');
  },
  edit: (req,res)=>{
    res.render('professionals/edit');
  }
}

module.exports = controller;