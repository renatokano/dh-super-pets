module.exports = (req, res, next) => {
  if(req.session.client) {
    res.locals.user_session = req.session.client;  
  }
  if(req.session.professional) {
    res.locals.professional_session = req.session.professional;  
  }
  next();
}