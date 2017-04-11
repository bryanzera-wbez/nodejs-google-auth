'use strict';

var express = require('express');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var restrictPath = require('./restrict-path').restrictPath;
var config = require('config');

// Configure sessions, passport
app.use(session(config.get('session')));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });

console.log("CALLBAKC URL", config.get('server.baseUrl') + config.get('googleStrategy.callbackPath'));

// Configure Google strategy
passport.use(new GoogleStrategy({
        clientID: config.get('googleStrategy.clientId'),
        clientSecret: config.get('googleStrategy.clientSecret'),
        callbackURL: config.get('server.baseUrl') + config.get('googleStrategy.callbackPath')
    },
    function(accessToken, refreshToken, profile, done) {
        if (config.has('googleStrategy.limitToDomain')) {
            if (!profile._json.domain || profile._json.domain != config.get('googleStrategy.limitToDomain')) {
                done("Wrong domain", null);
            }
        } else {
            done(false, profile);
        }
    }
));

// Add authorization routes
app.use('/auth', require('./routes/auth'));




// General, Unprotected Route.
app.get('/', function (req, res) { res.send('Public Path'); });

// secure route
app.get('/secure', restrictPath, function(req, res) { res.send("Secure Path"); });

// Start server
app.listen(3000, function () {
  console.log('Server running on 3000!');
});
