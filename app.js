
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

function getDays(date) {
  let now = new Date();
  let endDate = new Date(date);
  let differenceInTime = (endDate.getTime() - now.getTime());
  let days = differenceInTime / (1000*60*60*24);


  return Math.round(days);
}

let daysList = [];
daysList.push(new DaysUntilDate(_.startCase("Neujahr"), "01-01-2022"));
daysList.push(new DaysUntilDate(_.startCase("Geburtstag"), "12-15-2021"));
daysList.push(new DaysUntilDate(_.startCase("Sommerferien"), "06-07-2022"));




app.get("/", function(req, res){
  let currentDay = Object.assign({}, daysList[0]);

  currentDay.date = getDays(currentDay.date)


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
      currentDay = Object.assign({}, day);
    }
  });

  if(currentDay === null){
    currentDay = Object.assign({}, daysList[0]);
  }

  currentDay.date = getDays(currentDay.date)
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
  if(req.body.dateName === ""){
    res.redirect("/");
    return;
  }
  const dateName = _.startCase(req.body.dateName);
  const date = req.body.date;

  let daysUntilDate = new DaysUntilDate(dateName, date);

  let contains = false;
  daysList.forEach(function(day){
    if(day.name === dateName){
      contains = true;
    }
  });

  if(contains === false){
    daysList.push(daysUntilDate);
  }


  res.redirect("/" + dateName);
});
