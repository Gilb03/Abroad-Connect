require('dotenv').config()

const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        flash  = require('connect-flash'),
        passport = require('passport'),
        LocalStrategy = require('passport-local'),
        User = require('./models/user'),
        Opportunity = require('./models/opportunity'),
        methodOverride = require('method-override'),
        Comment = require('./models/comment');




const commentRoutes = require('./routes/comments');
const opportunityRoutes = require('./routes/opportunities');
const authRoutes = require('./routes/auth');

const databaseUri = process.env.MONGODB_URI;

mongoose.connect(databaseUri, { useNewUrlParser: true, useUnifiedTopology: true,
useCreateIndex: true
}).then(() => console.log(`Database connected`))
.catch(err => console.log(`Database connection error: ${err.message}`));


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB();

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

let port = process.env.PORT || 3000
app.listen(port, process.env.IP, function() {
console.log('server is listening on port: ' + port)
module.exports = app
});
