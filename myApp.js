var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

var Schema = mongoose.Schema;
var shortUrlSchema = new Schema({
  longUrl: {type: String,
         required: true},
  shortongUrl: {type: String,
         required: true}
});
var Person = mongoose.model('Person', personSchema);