var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1/shortly');

var db = mongoose.connection;

db.on('error', function() { console.error('connection error:'); });
// db.on('open', function() {
  module.exports.userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    createdAt: Date,
    updatedAt: Date
  });

  module.exports.urlSchema = new Schema({
    url: { type: String, required: true },
    baseUrl: { type: String, required: true },
    code: String,
    title: String,
    visits: { type: Number, default: 0 },
    createdAt: Date,
    updatedAt: Date
  // });
  
});

module.exports.db = db;
