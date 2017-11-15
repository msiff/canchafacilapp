/* jshint -W097, -W117, -W119 */
'use strict';
var mongoose    = require('mongoose');
var app         = require('./app');
var port        = process.env.PORT || 5200;
var passport    = require('passport');
var social      = require('./passport/passport')(app, passport);

// Creamos una conexion a la base de datos local.
mongoose.Promise = global.Promise; // Esto es para qutar un error por consola. 
mongoose.connect('mongodb://localhost:27017/canchafacil', { useMongoClient: true })
    .then( () => {
        console.log('La conexion a la base de datos "canchafacil" se realizo correctamente..');
        // Si es posible conectarse a la BD, creamos nuestro sv.
        app.listen(port, () => {
            console.log('Servidor local con node y express esta corriendo correctamente en el puerto: ' + port);
        });
    })
    .catch(err => console.log(err)
);