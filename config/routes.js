var User    = require('../db/models/userModel')

module.exports = function(app){


  app.get('/', function(req, res){
    res.render('../client/landing_page', { message: req.flash('signupMessage') });
  });

  app.post('/', function(req, res){
    console.log('post works', req.body)
    var newUser = new User();
    newUser.local.username = req.body.signupUsername;
    newUser.local.password = req.body.signupPassword; 
    console.log("Username & Password", newUser.local.username, newUser.local.password);
    newUser.save(function(err){
      if(err){
        throw err;
      }
    })
    res.redirect('/teacher');
  })


  app.get('/signup/:username/:password', function(req, res){
    var newUser = new User();
    newUser.local.username = req.params.username;
    newUser.local.password = req.params.password; 
    console.log("Username & Password", newUser.local.username, newUser.local.password);
    newUser.save(function(err){
      if(err){
        throw err;
      }
    })
    res.send('Success!');
  })

};
