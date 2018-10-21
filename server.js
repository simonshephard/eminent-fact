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
mongoose.connect(process.env.MONGO_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


var UrlModel = require('./myApp.js').UrlModel;
app.post("/api/shorturl/new", function (req, res, next) {
  
  // 1. this gives url back directly from post
  // res.json({ url: req.body });
  
  // 2. this creates url using schema and returns created url
  // var newUrl = new UrlModel({
  //   longUrl: req.body.url,
  //   shortUrl: 1
  // });
  // res.json({ newUrl: newUrl });

  // 3. this does same but increments the count - asynchronous so done in callback
  // Url.count({}, function(err, count) {
  //   var newUrl = new UrlModel({
  //     longUrl: req.body.url,
  //     shortUrl: count+1
  //   });
  //   res.json({ newUrl: newUrl });
  // });

  // 4. same but also saves newUrl to db
  // Url.count({}, function(err, count) {
  //   var newUrl = new UrlModel({
  //     longUrl: req.body.url,
  //     shortUrl: count+1
  //   });
  //   newUrl.save();
  //   res.json({ newUrl: newUrl });
  // });
  
  // // 5. same but just provide old and new url not _id
  // Url.count({}, function(err, count) {
  //   var newUrl = new UrlModel({
  //     longUrl: req.body.url,
  //     shortUrl: count+1
  //   });
  //   newUrl.save();
  //   res.json({
  //     original_url: newUrl.longUrl,
  //     short_url: newUrl.shortUrl
  //   });
  // });
  
  // 6. same but with check on valid url
  const url = require('url');
  const dns = require('dns');
  const postedUrl = url.parse(req.body.url);
  dns.lookup(postedUrl.hostname, (err, address, family) => {
    if (!address) {
      res.json({
        // address: address,
        // url: req.body.url,
        // errorType: err,
        error: "invalid URL"
      });
    } else {
      UrlModel.count({}, function(err, count) {
        var newUrl = new UrlModel({
          longUrl: req.body.url,
          shortUrl: count+1
        });
        newUrl.save();
        res.json({
          // lookup: postedUrl.hostname, 
          // address: address,
          // family: family,
          original_url: newUrl.longUrl,
          short_url: newUrl.shortUrl
        });
      });      
    }
  });
  
});


app.get("/api/shorturl/:shortURl", function (req, res) {
  let date = new Date(req.params.date_string);
  res.json({
    "unix": date.getTime(), "utc": date.toUTCString()
  });
});


// var findById = require('./myApp.js').findUrlById;
app.get('/:id', function(req, res, next) {
  // var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
  // var p = new Person({name: 'test', age: 0, favoriteFoods: ['none']});
  // p.save(function(err, pers) {
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



app.listen(port, function () {
  console.log('Node.js listening ...');
});