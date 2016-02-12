var db = require('../config');
var mongoose = require('mongoose');
var crypto = require('crypto');

db.urlSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isNew) {
    this.createdAt = this.updatedAt;
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    model.code = shasum.digest('hex').slice(0, 5);
  }
  next();
});

var Link = mongoose.model('Link', db.urlSchema);
module.exports = Link;
