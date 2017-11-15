/* jshint -W097, -W117, -W119 */
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/userModel');
var session = require('express-session');

module.exports = function (app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false
        }
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.use(new FacebookStrategy({
            clientID: 'passport.js163872397683863',
            clientSecret: 'db4f0e54da4b642edfdc056fd797fb00',
            callbackURL: "http://localhost:5200/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            // User.findOrCreate(..., function (err, user) {
            //     if (err) {
            //         return done(err);
            //     }
            //     done(null, user);
            // });
            done(null, profile); // le decimos null que no hay errores y nos devuelve el perfil de face.
        }
    ));
    app.get('api/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/login'
    }));
    app.get('api/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    return passport;
};