'use strict';

module.exports = {
    restrictPath: function (req, res, next) {
        console.log("RESTRICTING ON ", req.originalUrl);
        if (req.isAuthenticated()) {
            console.log("REQUEST AUTHENTICATED");
            return next();
        } else {
            console.log("REQUEST NOT AUTHENTICATED");
            res.redirect("/auth?redirectUrl=" + req.originalUrl);
        }
    }
};
