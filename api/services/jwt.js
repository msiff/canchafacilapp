/* jshint -W097, -W117, -W119 */
'use strict';
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

exports.createToken = function(user) {
    // Creamos un objeto que se va a encryptar en el token, con moment manejamos fechas, 
    // moment().unix(), ==> obtiene la fecha actual. Le vamos a dar tiempo de caducidad al token
    // de 30 dias.
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        iat: moment().unix(), 
        exp: moment().add(30, 'days').unix()
    };
    return jwt.encode(payload, secret);
};