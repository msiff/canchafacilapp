/* jshint -W097, -W117, -W119 */
'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var schema = mongoose.Schema;

// Creamos un modelo que contiene un userid, un token y una fecha de creado, que expira en 12 horas. A las 12 horas
// se borra automaticamente el documento. 

var solicitud = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: { type: Date, required: true, default: Date.now},
    aceptedAt: { type: Date, default: null}
});

module.exports = mongoose.model('solicitudOwner', solicitud);