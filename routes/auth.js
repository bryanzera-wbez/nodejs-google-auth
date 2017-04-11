var express = require('express'),
    router = express.Router(),
    passport = require('passport');

// Route to set return URL in session
router.get('/', function(req, res, next) {

    console.log("GENERIC AUTH SHORTCUT");
    console.log("REQUESTED FROM", req.query.redirectUrl);

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

module.exports = router;
