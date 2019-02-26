var  express = require("express");
var  app = express();
var bodyParser =require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

var opportunities = [
    {name: "Salmon Creek Scholarship", image: "https://pixabay.com/photos/home-office-workstation-office-336373/"},
    {name: "SAAB Scholarship", image: "https://pixabay.com/photos/home-office-workstation-office-336373/"},
    {name: "DOPE Scholarship", image: "https://pixabay.com/photos/home-office-workstation-office-336373/"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/opportunities", function(req, res){
 res.render("opportunities",{opportunities: opportunities});
});

app.post("/opportunities", function(req, res){
   // res.send("You hit the post route")
    //get data from form and add to array
    var name= req.body.name;
    var image= req.body.image;
    var description= req.body.description;
    var link= req.body.link;
    var newOpportunity= {name: name, image: image, description: description, link: link  }
    opportunities.push(newOpportunity);
    //redirect back to opportunity page
    res.redirect("/opportunities");
});

app.get("/opportunities/new", function(req, res){
    res.render("new.ejs");
});

const port = process.env.PORT || 3000
app.listen(port, process.env.IP, function() {
console.log('server is listening on port: ' + port)
module.exports = app
});