/* jshint -W097, -W117, -W119 */
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var Complejo = schema({
    name: {type: String, required: true},
    ciudad: {type: String, required: true},
    direccion: {type: String, required: true},
    telefono: {type: String, required: true},
    diasAbierto: {type: [false, false, false, false, false, false, false], required: true},
    horario: { desde: Number, hasta: Number, required: true},
    servicios: {type: [String]},
    descripcion: {type: String},
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    estado: { type: String, enum: ['publico', 'oculto'], default: 'oculto'},
    fechaPago: {type: Date, required: true},
    canchas: {type: Array},
    campeonatos: {type: Array}
});

module.exports = mongoose.model('Complejo', Complejo);