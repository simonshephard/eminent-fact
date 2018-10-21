var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);


// set up scheme for shortUrl
var Schema = mongoose.Schema;
var shortUrlSchema = new Schema({
  longUrl: {type: String,
         required: true},
  shortUrl: {type: String,
         required: true}
});
var ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);



var createAndSaveShortUrl;


var findUrlById = function(UrlId, done) {
  
  ShortUrl.findById(UrlId, function(err, data) {
    if (err) return done(err);
    return done(null, data);
  });
  
};


exports.ShortUrlModel = ShortUrl;
exports.createAndSaveShortUrl = createAndSaveShortUrl;
exports.findUrlById = findUrlById;
