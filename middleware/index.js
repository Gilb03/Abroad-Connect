// all the middleware gores here
var middlewareObj = {};
var Opportunity = require('../models/opportunity');
var Comment = require('../models/comment');

middlewareObj.checkOpportunityOwnership = function checkOpportunityOwnership(req, res, next) {
        if(req.isAuthenticated()){
            Opportunity.findById(req.params.id, function(err, foundOpportunity){
                if(err){
                    req.flash('error', "Opportunity could not be found");
                    res.redirect("back");
                } else {
                    if(foundOpportunity.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash('error', "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        }
    }

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', "You need to be logged in to do that");
    res.redirect('/login');
}

module.exports = middlewareObj;