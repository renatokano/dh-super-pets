module.exports = (req, res, next) => {
  // professional not logged in
  if(!req.session.professional) res.redirect('/home/index');
  // professional has a session
  res.locals.professional = req.session.professional;
  next();
}