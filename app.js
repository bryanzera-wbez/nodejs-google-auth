'use strict';

var express = require('express');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(session({
    cookie: {
        maxAge: 525600,
        name: 'nightmarefuel'
    },
    secret: 'nightmarefuel'}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

passport.use(new GoogleStrategy({
        clientID: '436101420902-st1bnc8v0vag2gg0htvb6mgfhp5mhbfj.apps.googleusercontent.com',
        clientSecret: 'j0v6gQdVSvlztuSywWQBFp09',
        callbackURL: "http://slimy-mule-3633.vagrantshare.com/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        if (!profile._json.domain || profile._json.domain != "chicagopublicradio.org") {
            done("Wrong domain", null)
        } else {
            done(false, profile);
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var restrict = function (req, res, next) {

    console.log("RESTRICTING ON ", req.originalUrl);

    if (req.isAuthenticated()) {
        console.log("REQUEST AUTHENTICATED");
        return next();
    } else {
        console.log("REQUEST NOT AUTHENTICATED");
        res.redirect("/auth?redirectUrl=" + req.originalUrl);
    }

};


// Route to set return URL in session
app.get('/auth', function(req, res, next) {

    console.log("GENERIC AUTH SHORTCUT");
    console.log("REQUESTED FROM", req.query.redirectUrl);

    req.session.loginRedirect = req.query.redirectUrl;

    // begin external authentication
    res.redirect('/auth/google');

});

// Generic route to start OAUTH2 login
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback Route for OAUTH2
app.get('/auth/google/callback',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        failureRedirect: '/login',
    }),
    function(req, res) {
        console.log("SUCCESSFUL RETURN FROM AUTHENTICATOR");
        if (req.session.loginRedirect) {
            console.log("SESSION REDIRECT SET:", req.session.loginRedirect);
            var tmp = req.session.loginRedirect;
            delete req.session.loginRedirect;
            res.redirect(tmp);
        } else {
            console.log("SESSION REDIRECTING HOME");
            res.redirect('/');
        }
    }
);

// General, Unprotected Route.
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/secure', restrict, function(req, res) {
    res.send("If you see this, you're authorized");
});

app.get('/secure2', restrict, function(req, res) {
    res.send("Second secure endpoint")
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
