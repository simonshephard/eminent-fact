var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);


// set up schema for url
var Schema = mongoose.Schema;
var urlSchema = new Schema({
  url: {type: String,
         required: true}
});
var url = mongoose.model('url', urlSchema);


var saveUrl = function(url, done) {

  url.save(function(err, data) {
    if (err) return done(err);
    return done(null, data);
  });

};


var findUrlById = function(UrlId, done) {
  
  url.findById(UrlId, function(err, data) {
    if (err) return done(err);
    return done(null, data);
  });
  
};


exports.url = url;
exports.saveUrl = saveUrl;
exports.findUrlById = findUrlById;
