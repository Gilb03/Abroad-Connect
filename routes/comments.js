var express = require('express');
var Opportunity = require('../models/opportunity');
var Comment = require('../models/comment');
var router  = express.Router({mergeParams: true});
var middlewareObj = require('../middleware');

// Comments NEW
router.get('/new', middlewareObj.isLoggedIn, function(req, res){
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
router.post('/', middlewareObj.isLoggedIn, function(req, res){
    // look up opportunity using ID
    Opportunity.findById(req.params.id, function(err, opportunity){
        if(err){
            console.log(err);
            res.redirect('/opportunities');
        } else {
                Comment.create(req.body.comment, function(err, comment){
                    if(err){
                        req.flash('error', "Something went wrong!");
                        console.log(err);
                    } else {
                        // add username and id to comment
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        //save comment
                        comment.save();
                        console.log(comment);
                        req.flash('success', "Successfully added comment");
                        opportunity.comments.push(comment);
                        opportunity.save();
                        res.redirect('/opportunities/' + opportunity._id);
                    }
                });
        }
    });
});
// COMMENT EDIT ROUTE
router.get('/:comment_id/edit', middlewareObj.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back');
        } else{
            res.render('comments/edit', {opportunity_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE ROUTE
router.put('/:comment_id', middlewareObj.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/opportunities/' + req.params.id);
        }
    });
});

//COMMENT DELETE form
router.delete('/:comment_id', middlewareObj.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        } else {
            req.flash('success', "Comment deleted");
            res.redirect('/opportunities/' + req.params.id);
        }
    });
});


module.exports = router;