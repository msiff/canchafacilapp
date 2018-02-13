/* jshint -W097, -W117, -W119, -W104 */
'use strict';
var express = require('express');
var userController = require('../controllers/userController');

// Por cada controller creo un archivo de rutas que se va a encargar se crear las rutas para
// llamar a la funcion correcta del controlador. 
var api = express.Router();

// Middlewares
var midAuth = require('../middlewares/authenticated');
// Con conect multiparty establezco la ruta donde se van a subir los archivos.
var multipart = require('connect-multiparty');
var midUpload = multipart({uploadDir: './uploads/users'});

api.get('/pruebas', userController.pruebas);
api.post('/registrar-user', userController.registrarUser);
api.post('/login', userController.loginUser);
api.post('/loginFacebook', userController.loginFacebook);
api.put('/update-user/:id', midAuth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id',[ midAuth.ensureAuth, midUpload ], userController.uploadImage);
api.get('/get-image-user/:imageFile', userController.getImage);
api.post('/confirmation/:token', userController.tokenConfirmation);
api.post('/resend-token/:email', userController.resendEmailToken);
//api.get('/get-users',midAuth.ensureAuth, userController.getUsers);

module.exports = api;