var db = require('../config');
var mongoose = require('mongoose');
var crypto = require('crypto');

db.urlSchema.pre('save', function(next) {
  this.updated_at = new Date();
  if (this.isNew) {
    this.created_at = this.updated_at;
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    model.code = shasum.digest('hex').slice(0, 5);
  }
  next();
});

var Link = mongoose.model('Link', db.urlSchema);
module.exports = Link;
