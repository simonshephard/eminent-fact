var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);


// set up schema for url
var Schema = mongoose.Schema;
var urlSchema = new Schema({
  longUrl: {type: String,
         required: true},
  shortUrl: {type: Number}
});
var Url = mongoose.model('url', urlSchema);


var saveUrl = function(url, done) {

  url.save(function(err, data) {
    if (err) return done(err);
    return done(null, data);
  });

};


var findUrlById = function(UrlId, done) {
  
  Url.findById(UrlId, function(err, data) {
    if (err) return done(err);
    return done(null, data);
  });
  
};


exports.UrlModel = Url;
exports.saveUrl = saveUrl;
exports.findUrlById = findUrlById;
