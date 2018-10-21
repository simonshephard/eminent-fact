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

var Url = require('./myApp.js').UrlModel;

app.post("/api/shorturl/new", function (req, res, next) {
  
  // 1. this gives url back directly from post
  // res.json({ url: req.body });
  
  // 2. this creates url using schema and returns created url
  // var newUrl = new Url({
  //   longUrl: req.body.url,
  //   shortUrl: 1
  // });
  // res.json({ newUrl: newUrl });

  // 3. this does same but increments the count - asynchronous so done in callback
  // Url.count({}, function(err, count) {
  //   var newUrl = new Url({
  //     longUrl: req.body.url,
  //     shortUrl: count+1
  //   });
  //   res.json({ newUrl: newUrl });
  // });

  // 4. same but also saves newUrl to db
  // Url.count({}, function(err, count) {
  //   var newUrl = new Url({
  //     longUrl: req.body.url,
  //     shortUrl: count+1
  //   });
  //   newUrl.save();
  //   res.json({ newUrl: newUrl });
  // });
  
  // // 5. same but just provide old and new url not _id
  // Url.count({}, function(err, count) {
  //   var newUrl = new Url({
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
  const postedUrl = new URL(req.body.url, req.body.url.value);
  dns.lookup(postedUrl.hostname, (err, address, family) => {
    if (err) {
      // res.json({ error: "invalid URL" });
      res.json({
        url: req.body.url,
        error: err
      });
    } else {
      Url.count({}, function(err, count) {
        var newUrl = new Url({
          longUrl: req.body.url,
          shortUrl: count+1
        });
        newUrl.save();
        res.json({
          address: address,
          family: family,
          original_url: newUrl.longUrl,
          short_url: newUrl.shortUrl
        });
      });      
    }
  });
  
  
});

// router.post('/mongoose-model', function(req, res, next) {
//   // try to create a new instance based on their model
//   // verify it's correctly defined in some way
//   var p;
//   p = new Person(req.body);
//   res.json(p);
// });

// var findById = require('./myApp.js').findUrlById;
// app.get('/find-by-id', function(req, res, next) {
//   // var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
//   // var p = new Person({name: 'test', age: 0, favoriteFoods: ['none']});
//   // p.save(function(err, pers) {
//     if(err) { return next(err) }
//     findById(pers._id, function(err, data) {
//       clearTimeout(t);
//       if(err) { return next(err) }
//       if(!data) {
//         console.log('Missing `done()` argument');
//         return next({message: 'Missing callback argument'});
//       }
//       res.json(data);
//       p.remove();
//     });
//   });
// });



app.listen(port, function () {
  console.log('Node.js listening ...');
});