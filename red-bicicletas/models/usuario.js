const mongoose = require('mongoose');
const Reserva = require('./reserva');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const Token = require('../models/token');
const mailer = require('../mailer/mailer');

const Schema = mongoose.Schema;
const saltRounds = 10;

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'Este campo es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Este campo es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor ingrese un correo válido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'Este campo es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    },/*
    googleId: String,
	facebookId: String*/
});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario'});

usuarioSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb) {
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    console.log(reserva);
    reserva.save(cb);
}

usuarioSchema.methods.enviar_email_bienvenida = function (cb) {
    const token = new Token({userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    console.log(token)
    const email_destination = this.email;
    token.save(function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log("Hola3")
        const mailOptions = {
            from: 'no-reply@unmail.com',
            to: email_destination,
            subject: 'Verificación de cuenta',
            text: 'Hola, \n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000'`\/token/confirmation\/` + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log('A verification email has been sent to ' + email_destination + '.');
        });
    });
};/*

usuarioSchema.methods.resetPassword = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err) {
        if (err) { return cb(err); }

        const mailOptions = {
            from: 'no-reply@BicycleNetwork.com',
            to: email_destination,
            subject: 'Password reset',
            text: 'Hi,\n\n' + 'Please click on this link to reset your account password:\n' + 'http://localhost:5000' + '\/resetPassword\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) { return cb(err); }
            console.log('An email to reset the password was sent to' + email_destination + '.');
        });

        cb(null);
    });
};

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition,callback) {
    const self = this;
    console.log(condition);
    self.findOne({
            $or: [{
                    'googleId': condition.id}, {'email': condition.emails[0].value}
            ]}, (err, result) => {
            if (result) {
                callback(err, result);
            } else {
                console.log('------------CONDITION-------------');
                console.log(condition);
                let values = {};
                values.googleId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || 'SIN NOMBRE';
                values.verificado = true;
                values.password = condition._json.etag;
                console.log('------------VALUES----------');
                console.log(values);
                self.create(values, (err, result) => {
                    if (err) {console.log(err);}
                    return callback(err, result);
                })
            }
     })
};

usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreateByFacebook(condition,callback) {
    const self = this;
    console.log(condition);
    self.findOne({
            $or: [{
                    'facebookId': condition.id}, {'email': condition.emails[0].value}
            ]}, (err, result) => {
            if (result) {
                callback(err, result);
            } else {
                console.log('--------------- CONDITION ---------------');
                console.log(condition);
                let values = {};
                values.facebookId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || 'SIN NOMBRE';
                values.verificado = true;
                values.password = crypto.randomBytes(16).toString('hex');//condition._json.etag;
                console.log('------------ VALUES -----------');
                console.log(values);
                self.create(values, (err, result) => {
                    if (err) {console.log(err);}
                    return callback(err, result);
                })
            }
        });
};

*/
module.exports = mongoose.model('Usuario', usuarioSchema);