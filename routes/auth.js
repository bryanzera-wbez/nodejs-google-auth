var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    config = require('config');

// Route to set return URL in session
router.get('/', function(req, res, next) {

    if (config.get('debug')) { console.log("REQUESTED FROM", req.query.redirectUrl); }

    req.session.loginRedirect = req.query.redirectUrl;

    // begin external authentication
    res.redirect('/auth/google');

});

// Generic route to start OAUTH2 login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback Route for OAUTH2
router.get('/google/callback',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        failureRedirect: '/auth',
    }),
    function(req, res) {
        if (config.get('debug')) { console.log("SUCCESSFUL RETURN FROM AUTHENTICATOR"); }
        if (req.session.loginRedirect) {
            if (config.get('debug')) { console.log("SESSION REDIRECT SET:", req.session.loginRedirect); }
            var tmp = req.session.loginRedirect;
            delete req.session.loginRedirect;
            res.redirect(tmp);
        } else {
            if (config.get('debug')) { console.log("SESSION REDIRECTING HOME"); }
            res.redirect('/');
        }
    }
);

module.exports = router;
