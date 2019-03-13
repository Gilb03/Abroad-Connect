var express = require('express');
var router  = express.Router();
var Opportunity = require('../models/opportunity');
var middlewareObj = require('../middleware');

// INDEX Route - Show all opportunities
router.get('/', function(req, res){
    // get all opportunities from the DB
    Opportunity.find({}, function(err, allOpportunities){
        if(err){
            console.log(err);
        } else {
            res.render('opportunities/index',{opportunities: allOpportunities, currentUser: req.user});
        }
    });
});
// CREATE ROUTE - Add new opportunity to dB
router.post('/', middlewareObj.isLoggedIn, function(req, res){
    //get data from form and add to array
    var name= req.body.name;
    var image= req.body.image;
    var link= req.body.link;
    var description= req.body.description;
    var author = { 
        id: req.user._id,
        username: req.user.username
    }
    var newOpportunity= {name: name, image: image, link: link, description: description, author: author}
    // create new opportunity and save to database
    Opportunity.create(newOpportunity, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to opportunity page
            console.log(newlyCreated);
            res.redirect('/opportunities');
        }

    });
});
//NEW ROUTE - Show form to create new opportunity
router.get('/new', middlewareObj.isLoggedIn, function(req, res){
    res.render('opportunities/new');
});

//SHOW ROUTE 
router.get('/:id', function(req, res){
    // find opportunity with provided ID
    Opportunity.findById(req.params.id).populate('comments').exec( function(err, foundOpportunity){
        if(err){
            console.log(err);
        } else{
            console.log(foundOpportunity);
              // render show template with that singular opportunity
    res.render('opportunities/show', {opportunity: foundOpportunity}); 
        }
    });
 
});

// EDIT OPPORTUNITY ROUTE
router.get("/:id/edit", middlewareObj.checkOpportunityOwnership, function(req, res){
    Opportunity.findById(req.params.id, function(err, foundOpportunity){
     res.render("opportunities/edit", {opportunity: foundOpportunity}); 
   });
});
//UPDATE OPPORTUNITY ROUTE
router.put('/:id', middlewareObj.checkOpportunityOwnership, function(req, res){
    // we need to find the correct opportunity
    Opportunity.findByIdAndUpdate(req.params.id, req.body.opportunity, function(err, updatedOpportunity){
       if(err){
        res.redirect('/opportunities');
       } else{
            res.redirect('/opportunities/' + req.params.id);
       }
    });
    //redirect somewhere (show page)
});

// DESTROY OPPORTUNITY ROUTE
router.delete('/:id', middlewareObj.checkOpportunityOwnership, function(req, res){
    Opportunity.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/opportunities');
        } else{
            res.redirect('/opportunities');
        }
    })
});


module.exports = router;
