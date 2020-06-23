module.exports = (req, res, next) => {
  // professional not logged in
  if(!req.session.professional) {
    req.flash('error', 'Usuário deve estar logado para continuar! Faça o login e tente novamente.');
    return res.redirect('/');
  }
  // professional has a session
  res.locals.professional_session = req.session.professional;
  next();
}