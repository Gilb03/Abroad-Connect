// AUTH ROUTES
var express = require('express');
var router  = express.Router();
var passport = require('passport');
var User     = require('../models/user');

// ROOT route
router.get('/', function(req, res){
    res.render('landing');
});
//show register form
router.get('/register', function(req, res){
    res.render('register');
});
//handle Sign up logic
router.post('/register', function(req, res){
   var newUser = new User(new User({username: req.body.username}));
if(req.body.adminCode ==='thisShitRightHere'){
  newUser.isAdmin = true;
}
   User.register(newUser, req.body.password, function(err, user){
       if(err){
        req.flash('error', err.message);
           return res.render('register');
       }
       passport.authenticate('local')(req, res, function(){
        req.flash('success', "Welcome to Abroad Connect " + user.username);
           res.redirect('/opportunities');
       });
   });
});

//show login form
router.get('/login', function (req, res){
    res.render('login');
});
//handle login logic
router.post('/login', passport.authenticate ('local',
{
    successRedirect: '/opportunities',
    failureRedirect: '/login'
}), function(req, res){

});
// logout route
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', "Logged you out!");
    res.redirect('/opportunities');
});

//blog router
router.get('/about', function(req, res){
  res.render('about');
});


module.exports = router;
