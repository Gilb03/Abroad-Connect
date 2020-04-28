// AUTH ROUTES
const express = require('express'),
      router  = express.Router(),
      passport = require('passport'),
      Opportunity = require('../models/opportunity')
       User     = require('../models/user');


// ROOT route
router.get('/', function(req, res){
    return res.render('landing');
});
//show register form
router.get('/register', function(req, res){
    res.render('register');
});
//handle Sign up logic
router.post('/register', function(req, res){
   var newUser = new User(new User({username: req.body.username}));
if(req.body.adminCode ==='DannieBoylesApp'){
  newUser.isAdmin = true;
}
   User.register(newUser, req.body.password, function(err, user){
       if(err){
        req.flash('error', err.message);
           res.render('register')
       }
       passport.authenticate('local')(req, res, function(){
        req.flash('success', "Welcome to Abroad Connect " + user.username);
           res.redirect('/opportunities');
       });
   });
});

//show login form
router.get('/login', function (req, res){
    res.render('login')
});
//handle login logic
router.post('/login', passport.authenticate ('local',
{
    successRedirect: '/opportunities',
    failureRedirect: '/login'
}), function(req, res){

});
//about router
router.get('/about', function(req, res){
  res.render('about');
});

// logout route
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', "Logged you out!");
    res.redirect('/opportunities');
});
/*
// forgot route
router.get('/forgot', function(req, res){
    res.render('forgot');
});

// hint : check that crypto code match works
router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, (err, buf)=> {
          var token = buf.toString('hex');
          done(err, token);
          if (err) throw err;
          console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'gilbertking91@gmail.com',
            pass: process.env.GMAILPW
          }
        });

USER PROFILE
  router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      
      Opportunity.find().where('author.id').equals(foundUser._id).exec(function(err, opportunities) {
        if(err) {
          req.flash("error", "Something went wrong.");
          res.redirect("/");
        }
        res.render("users/show", {user: foundUser, opportunities: opportunities});
      })
    });
  });
  
*/


module.exports = router;
