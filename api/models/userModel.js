/* jshint -W097, -W117, -W119 */
'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var schema = mongoose.Schema;

var User = schema({
    name: String,
    surname: String,
    email: {type: String, unique: true},
    isVerified: { type: Boolean, default: false },
    password: String,
    celular: {type: String, default: ''},
    role: { type: String, enum: ['client', 'owner', 'admin'], default: 'client'},
    image: {type: String, default: 'Null'}, // Esta es la foto local
    photoUrl: {type: String, default: 'Null'}, // Esta foto es la de facebook
    clientData: { complejosFav: [String], confiabilidad: Number, asistencias: Number},
    ownerData: { misComplejos: [String] },
    providers: {facebook: {uid: String} },
    createdAt: { type: Date, required: true, default: Date.now}

    // Aca en complejos favoritos o mis complejos debemos especificarle que el objeto
    // que va guardado es de tipo Complejo para poder hacer populate.
});

// Creamos un metodo que sea capas de verificar una contraseña
User.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', User);
// Aqui mongoose cuando guarde en su coleccion va a buscarla por nombre "users", pluraliza automatico.