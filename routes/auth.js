// AUTH ROUTES
var express = require('express');
var router  = express.Router();
var passport = require('passport');
var Opportunity = require('../models/opportunity');
var User     = require('../models/user');
var async = require('async');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var nodemailer = require('nodemailer');
var crypto = require('crypto');

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
if(req.body.adminCode ==='DannieBoylesApp'){
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
        var mailOptions = {
          to: user.email,
          from: 'gilbertking91@gmail.com',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  //hint: "Cannot POST /reset"
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'gilbertking91@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'gilbertking91@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/opportunities');
    });
  });
  
  // USER PROFILE
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
  



module.exports = router;
