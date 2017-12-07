/* jshint -W097, -W117, -W119 */
'use strict';
var express = require('express');
var bodyParser = require('body-parser');

var app = express(); // carga el framework de express 

// cargar rutas
var userRoutes = require('./routes/userRoutes');

// middlewares de body-parser
app.use(bodyParser.urlencoded({ extended: false })); // Config necesaria para usar bodyP.
app.use(bodyParser.json()); // Lo que me llegue por el body lo convierte a json para usarlo directamente.

// configurar cabeceras y cors 
app.use(function (req, res, next) {
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Pass to next layer of middleware
    next();
});

// rutas bases - body-parser
app.use('/api', userRoutes); // para que todas las url de nuestra api precedan de /api.
// app.post('/confirmation', userController.confirmationPost); // Esta es para confirmar el email
// app.post('/resend', userController.resendTokenPost); // Esta es para renviar el token en caso de ser necesario. 

module.exports = app;