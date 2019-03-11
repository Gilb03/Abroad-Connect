var express = require('express');
var Opportunity = require('../models/opportunity');
var Comment = require('../models/comment');
var router  = express.Router({mergeParams: true});

// Comments NEW
router.get('/new',isLoggedIn, function(req, res){
    // find opportunity by Id
    Opportunity.findById(req.params.id, function(err, opportunity){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {opportunity: opportunity});
        }
    });
});
// Comments CREATE
router.post('/', isLoggedIn, function(req, res){
    // look up opportunity using ID
    Opportunity.findById(req.params.id, function(err, opportunity){
        if(err){
            console.log(err);
            res.redirect('/opportunities');
        } else {
                Comment.create(req.body.comment, function(err, comment){
                    if(err){
                        console.log(err);
                    } else {
                        opportunity.comments.push(comment);
                        opportunity.save();
                        res.redirect('/opportunities/' + opportunity._id);
                    }
                });
        }
    });
});
//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;