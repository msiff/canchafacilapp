/* jshint -W097, -W117, -W119, -W104 */
'use strict';
var express = require('express');
var adminController = require('../controllers/adminController');
var api = express.Router();

// Middlewares
var midAuth = require('../middlewares/authenticated');

// Rutas
api.get('/get-users',midAuth.ensureAuth, adminController.getUsers);
api.get('/get-solicitudes',midAuth.ensureAuth, adminController.getSolicitudes);
api.post('/new-owner/:id',midAuth.ensureAuth, adminController.newOwner);

module.exports = api;