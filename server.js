'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

const url = require('url');
const dns = require('dns');


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


var findUrlByShortUrl = require('./myApp.js').findUrlByShortUrl;
app.get("/api/shorturl/:shortUrl", function (req, res) {
  findUrlByShortUrl(req.params.shortUrl, function(err, data) {
    // res.json({
    //   return: data,
    //   url: data[0].longUrl,
    //   parsed: url.parse(data[0].longUrl),
    //   href: url.parse(data[0].longUrl).href
    // });
    // res.redirect(url.parse(data[0].longUrl).href);
    res.redirect(data[0].longUrl);
  });
});

// EXAMPLE parsed url
// "parsed": {
//   "protocol": "https:",
//   "slashes": true,
//   "auth": null,
//   "host": "www.freecodecamp.com",
//   "port": null,
//   "hostname": "www.freecodecamp.com",
//   "hash": null,
//   "search": null,
//   "query": null,
//   "pathname": "/",
//   "path": "/",
//   "href": "https://www.freecodecamp.com/"
// }

app.listen(port, function () {
  console.log('Node.js listening ...');
});