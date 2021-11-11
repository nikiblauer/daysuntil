
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");


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
daysList.push(new DaysUntilDate("Neujahr", 50));
daysList.push(new DaysUntilDate("Geburtstag", 50));
daysList.push(new DaysUntilDate("Sommerferien", 200));





app.get("/", function(req, res){

  const options = {
    daysList: daysList,
    dateToday: new Date()
  };
  res.render("pages/index", options);
});

app.listen(port, function(){
  console.log("Server started on port: " + port);
});

app.post("/", function(req, res){
  const dateName = req.body.dateName;
  const date = req.body.date;

  let daysUntilDate = new DaysUntilDate(dateName, date);

  daysList.push(daysUntilDate);


  res.redirect("/");
});