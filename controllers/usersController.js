const controller = {
  show: (req,res)=>{
    res.render('users/show');
  },
  admin: (req,res)=>{
    res.render('users/admin');
  },
  new: (req,res)=>{
    res.render('users/new');
  },
  edit: (req,res)=>{
    res.render('users/edit');
  }
}

module.exports = controller;