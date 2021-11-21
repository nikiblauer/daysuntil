//libraries
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const _ = require('lodash');
const mongoose = require("mongoose");


//server initialization
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set("view engine", "ejs");


//mongoose initialization
mongoose.connect("mongodb://localhost:27017/daysuntilDB");
const daySchema = new mongoose.Schema({
  name: String,
  date: String
});
const DayModel = mongoose.model("Day", daySchema); //used for creating new documents in database

//helper function - convert calender date to days left
function getDays(date) {
  const now = new Date();
  const endDate = new Date(date);
  let differenceInTime = (endDate.getTime() - now.getTime()); //calculate difference between dates in milliseconds
  const days = Math.round((differenceInTime / (1000 * 60 * 60 * 24))); //convert milliseconds to days


  return days;
}

////////////////////////////////////////////////////////////////////////////
// default route
////////////////////////////////////////////////////////////////////////////
app.get("/", function(req, res) {
  // Check for deletion query string in URL -> e.g. http://daysuntil.com/?delete=abcDate
  const deleteQuery = _.startCase(req.query.delete);
  if (deleteQuery.length > 0) {

    DayModel.deleteOne({
      name: deleteQuery
    }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result.deletedCount > 0) {
          console.log("Deleted: " + deleteQuery);
        } else {
          console.log("Couldn't find entry: " + deleteQuery);
        }
      }
    });

    res.redirect("/");
    return;
  }

  //Display first element of daysuntil-database when no specific route is given
  DayModel.find({}, function(err, docs) {
    if (err) {
      console.log(err);
    } else {

      let currentday = null;
      let options = null;

      //check if database already contains entries
      if (docs.length > 0) {
        currentDay = docs[0]; // select first document in database
        currentDay.date = getDays(currentDay.date); //convert date to days-left

        options = {
          currentDay: currentDay,
          daysList: docs,
          dateToday: new Date()
        };

      } else { // if not, send null-option to ejs
        options = {
          currentDay: null,
          daysList: null,
          dateToday: null
        }
      }

      res.render("pages/index", options); // render page
    }
  });

});

////////////////////////////////////////////////////////////////////////////
//display entry when specific name is given
////////////////////////////////////////////////////////////////////////////
app.get("/:name", function(req, res) {
  DayModel.find({}, function(err, docs) {
    if (err) {
      console.log(err);
    } else {

      let currentDay = null; // init currentDay with null
      let options = null;

      if (docs.length > 0) {
        const dayName = _.startCase(req.params.name); // extract dayname from url
        // check if dayname is in database, if yes currentDay = doc, if not currentDay = null
        for (var i = 0; i < docs.length; i++) {
          if (dayName === docs[i].name) {
            currentDay = docs[i];
            break;
          }
        }
        // if currentDay === null, redirect to default route
        if (currentDay === null) {
          res.redirect("/");
          return;
        }

        currentDay.date = getDays(currentDay.date); //convert date to days-left

        options = {
          currentDay: currentDay,
          daysList: docs,
          dateToday: new Date()
        };

        res.render("pages/index", options);

      } else { // if no docs in database redirect to default route and handle the problem there
        res.redirect("/");
        return;
      }
    }
  });
});



////////////////////////////////////////////////////////////////////////////
// create new days
////////////////////////////////////////////////////////////////////////////
app.post("/", function(req, res) {
  // check if name was given, if not redirect to home route
  if (req.body.dateName === "") {
    res.redirect("/");
    return;
  }

  // parse form inputs
  const dateName = _.startCase(req.body.dateName);
  const date = req.body.date;


  // check if name is already in use
  DayModel.find({
    name: dateName
  }, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      if (docs.length === 0) { // if not already used create new day
        let newDay = new DayModel({
          name: dateName,
          date: date
        });
        newDay.save();
      } else {
        console.log("Date already in list.");
      }
    }
  });

  res.redirect("/" + dateName);
});


////////////////////////////////////////////////////////////////////////////
// listen for incoming connections
////////////////////////////////////////////////////////////////////////////
app.listen(port, function() {
  console.log("Server started on port: " + port);
});
