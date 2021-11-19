
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const _ = require('lodash');
const mongoose = require("mongoose");


const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");


mongoose.connect("mongodb://localhost:27017/daysuntilDB");
const daySchema = new mongoose.Schema({
  name: String,
  date: String
});

const DayModel = mongoose.model("Day", daySchema);
const testDay1 = new DayModel({name: _.startCase("Neujahr"), date: "01-01-2022"});
const testDay2 = new DayModel({name: _.startCase("Geburtstag"), date: "12-15-2021"});
const testDay3 = new DayModel({name: _.startCase("Sommerferien"), date: "06-07-2022"});

const defaultDays = [testDay1, testDay2, testDay3];

// DayModel.insertMany(defaultDays, function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Successfully saved default days to DB.");
//   }
// });

// DayModel.find({}, function(err, docs) {
//   if(err){
//     console.log(err);
//   } else {
//     docs.forEach(function(doc){
//       console.log(doc.name);
//     });
//   }
// });

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
  DayModel.find({}, function(err, docs){
    if(err){
      console.log(err);
    } else{

      let currentDay = docs[0];
      currentDay.date = getDays(currentDay.date);

      const options = {
        currentDay: currentDay,
        daysList: docs,
        dateToday: new Date()
      };

      res.render("pages/index", options);
    }
  });

});

app.get("/:name", function(req, res){
  DayModel.find({}, function(err, docs){
    if(err){
      console.log(err);
    } else{

      const dayName = _.startCase(req.params.name);

      let currentDay = docs[0];

      for( var i=0; i<docs.length; i++){
        if(dayName === docs[i].name){
          currentDay = docs[i];
          break;
        }
      }

      currentDay.date = getDays(currentDay.date);

      const options = {
        currentDay: currentDay,
        daysList: docs,
        dateToday: new Date()
      };

      res.render("pages/index", options);
    }
  });
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


  DayModel.find({name: dateName}, function(err, docs){
    if(err){
      console.log(err);
    } else {
      if(docs.length === 0){
        let newDay = new DayModel({name: dateName, date: date});
        newDay.save();
      } else {
        console.log("Date already in list.");
      }
    }
  });



  res.redirect("/" + dateName);
});
