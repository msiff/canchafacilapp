/* jshint -W097, -W117, -W119, -W104 */
'use strict';
// Modelos
var User = require('../models/userModel');

// Esta funcion devuelve todos los usuarios..
function getUsers(req, res) {
    if (req.user.role == 'admin') {
        User.find({}, (err, users) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en la peticion!'
                });
            } else {
                if (!users) {
                    res.status(404).send({
                        message: 'No hay usuarios!'
                    });
                } else {
                    res.status(200).send({
                        users
                    });
                }
            }
        });
    } else {
        res.status(404).send({message: 'No tienes permiso para realizar esta peticion.'});
    }
}

module.exports = {getUsers};