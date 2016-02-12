var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

db.userSchema.pre('save', function(next) {
  console.log('saving user ===============================');

  this.createdAt = new Date();
  if (this.isNew) {
    this.createdAt = this.createdAt;
    this.hashPassword();
  }
  next();
});

db.userSchema.methods.hashPassword = function() {
  console.log('hashing password, this: ', this);

  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      this.save();
    });
};

db.userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    console.log('attemptedPassword: ', attemptedPassword);
    console.log('this.password: ', this.password);
    callback(isMatch);
  });
};

var User = mongoose.model('User', db.userSchema);
module.exports = User;
