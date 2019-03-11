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
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       } 
       passport.authenticate('local')(req, res, function(){
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
    res.redirect('/opportunities');
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;