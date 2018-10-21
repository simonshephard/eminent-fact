var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);


// set up schema for url
var Schema = mongoose.Schema;
var urlSchema = new Schema({
  longUrl: {type: String,
         required: true},
  shortUrl: {type: Number}
});
var UrlModel = mongoose.model('url', urlSchema);


var findUrlById = function(UrlId, done) {
  
  UrlModel.findById(UrlId, function(err, data) {
    if (err) return done(err);
    return done(null, data);
  });
  
};


exports.UrlModel = UrlModel;
exports.findUrlById = findUrlById;
