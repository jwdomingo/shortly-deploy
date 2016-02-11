var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:4568/db');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  console.log('Mongoose Connection Established!');

  db.userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    created_at: Date,
    updated_at: Date
  });

  db.urlSchema = new Schema({
    url: { type: String, required: true },
    baseUrl: { type: String, required: true },
    code: String,
    title: String,
    visits: { type: Number, default: 0 },
    created_at: Date,
    updated_at: Date
  });
});

module.exports = db;