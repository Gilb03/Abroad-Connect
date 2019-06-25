require('dotenv').config()

var  express = require('express');
var  app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash  = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var Opportunity = require('./models/opportunity');
var methodOverride = require('method-override');
var Comment = require('./models/comment');
var seedDB = require('./seeds');



var commentRoutes = require('./routes/comments');
var opportunityRoutes = require('./routes/opportunities');
var authRoutes = require('./routes/auth');

var databaseUri = process.env.MONGODB_URI;

mongoose.connect(databaseUri, {useNewUrlParser: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
seedDB();

//Passport Config
app.use(require('express-session')({
    secret:'This is Danielle Boyles application',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
res.locals.currentUser = req.user;
res.locals.error = req.flash('error');
res.locals.success = req.flash('success');
next();
});

// REQUIRING ROUTES
app.use('/opportunities', opportunityRoutes);
app.use('/opportunities/:id/comments',commentRoutes);
app.use('/',authRoutes);

const port = process.env.PORT || 3000
app.listen(port, process.env.IP, function() {
console.log('server is listening on port: ' + port)
module.exports = app
});
