module.exports = (req, res, next) => {
  // client not logged in
  if(!req.session.client) res.redirect('/');
  // client has a session
  res.locals.user_session = req.session.client; // <- don't use res.locals.client
  // In the later versions of EJS the "client" parameter key is reserved, 
  // and will therefore cause errors. j/ rename the key and resolve the issue. 
  next();
}