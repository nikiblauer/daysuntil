
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
var _ = require('lodash');


const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine", "ejs");


function DaysUntilDate(name, date){
  this.name = name;
  this.date = date;
}

let daysList = [];
daysList.push(new DaysUntilDate(_.startCase("Neujahr"), 50));
daysList.push(new DaysUntilDate(_.startCase("Geburtstag"), 50));
daysList.push(new DaysUntilDate(_.startCase("Sommerferien"), 200));




app.get("/", function(req, res){
  let currentDay = daysList[0];

  const options = {
    currentDay: currentDay,
    daysList: daysList,
    dateToday: new Date()
  };
  res.render("pages/index", options);
});

app.get("/:name", function(req, res){
  const dayName = _.startCase(req.params.name);
  let currentDay = null;
  daysList.forEach(function(day){
    if(day.name === dayName){
      currentDay = day;
    }
  });

  if(currentDay === null){
    currentDay = daysList[0];
  }

  const options = {
    currentDay: currentDay,
    daysList: daysList,
    dateToday: new Date()
  };
  res.render("pages/index", options);

});

app.listen(port, function(){
  console.log("Server started on port: " + port);
});

app.post("/", function(req, res){
  const dateName = _.startCase(req.body.dateName);
  const date = req.body.date;

  let daysUntilDate = new DaysUntilDate(dateName, date);

  daysList.push(daysUntilDate);


  res.redirect("/" + dateName);
});
