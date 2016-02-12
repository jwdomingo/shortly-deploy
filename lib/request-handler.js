var request = require('request');
var crypto = require('crypto');
var util = require('../lib/utility');

var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find( function(err, links) {
    if (err) { throw Error('could not fetch links'); }
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({ url: uri }, function(err, link) {
    if (err) { throw Error('link not found'); }
    if (link) {
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save();
        res.send(200, newLink);
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err) {
        if (err) { throw Error('user could not be saved'); }
        else { util.createSession(req, res, newUser); }
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(err, link) {
    if (err) { throw Error('link could not be found'); }
    else if (!link) {
      res.redirect('/');
    } else {
      link.visits += 1;
      return res.redirect(link.url);
    }
  });
};