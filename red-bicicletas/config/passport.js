const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;/*
const googleStrategy = require('passport-google-oauth2').Strategy;
const facebookStrategy = require('passport-facebook-token');*/
const Usuario = require('../models/usuario');

passport.use(new LocalStrategy(function (email, password, done) {
    Usuario.findOne({ email: email }, function (err, usuario) {
        if (err) {
            return done(err);
        }
        if (!usuario) {
            return done(null, false, { message: 'Email no existente o incorrecto' });
        }
        if (!usuario.verificado) {
            return done(null, false, { message: 'Usuario no verificado' });
        }
        if (!usuario.validPassword(password)) {
            return done(null, false, { message: 'Password incorrecto' });
        }

        return done(null, usuario);
    });
}));
/*
passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/google/callback"
},
    function (request, accessToken, refreshToken, profile, done) {
        Usuario.findOrCreateByGoogle(profile, function (err, user) {
            return done(err, user);
        });
    }
));

passport.use(new facebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
},
    function (accessToken, refreshToken, profile, done) {
        Usuario.findOrCreateByFacebook(profile, function (err, user) {
            return done(err, user);
        });
    }
));*/

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    Usuario.findById(id, function (err, usuario) {
        cb(err, usuario);
    });
});

module.exports = passport;