'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


var findUrlById = require('./myApp.js').findUrlById;
router.get('/find-by-id', function(req, res, next) {
  var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
  var p = new Person({name: 'test', age: 0, favoriteFoods: ['none']});
  p.save(function(err, pers) {
    if(err) { return next(err) }
    findById(pers._id, function(err, data) {
      clearTimeout(t);
      if(err) { return next(err) }
      if(!data) {
        console.log('Missing `done()` argument');
        return next({message: 'Missing callback argument'});
      }
      res.json(data);
      p.remove();
    });
  });
});



app.listen(port, function () {
  console.log('Node.js listening ...');
});