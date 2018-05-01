module.exports = function(app, passport) {

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  app.post('/signup', passport.authenticate('local-signup'));

};
