'use strict';

var config = require('config');

module.exports = {
    restrictPath: function (req, res, next) {

        if (config.get('debug')) { console.log("RESTRICTING ON ", req.originalUrl); }

        if (req.isAuthenticated()) {
            if (config.get('debug')) { console.log("REQUEST AUTHENTICATED"); }
            return next();
        } else {
            if (config.get('debug')) { console.log("REQUEST NOT AUTHENTICATED"); }
            res.redirect("/auth?redirectUrl=" + req.originalUrl);
        }
    }
};
