/* jshint -W097, -W117, -W119, -W104 */
'use strict';
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

// 
exports.ensureAuth = function(req, res, next) {
    var payload;
    // compureba si viene cabecera de autenticacion
    // console.log(req.headers);
    if (!req.headers.authorization) {
        // console.log('Entro!');
        return res.status(403).send({message: 'La peticion no tiene cabecera de autenticacion'});
    }
    // remplaza las comillas simples y doble por nada. 
    var token = req.headers.authorization.replace(/[' "]+/g, '');
    try {
        // decripta el token y se obtienen los datos del usuario.
        payload = jwt.decode(token, secret);
        // comprueba si la fecha de expiracion que se le asigno al token aun es valida.
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'el toquen a expirado'});
        }
    } catch (ex) {
        return res.status(404).send({message: 'el toquen no es valido'});
    }
    // le asigno a la request el usuario del token con todos sus datos para tenerlo disponible
    // en las peticiones!
    req.user = payload;
    // Next para pasar al siguiente metodo de la ruta y que no se quede aca dentro. 
    next();
};