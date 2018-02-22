/* jshint -W097, -W117, -W119, -W104 */
'use strict';
// Modelos
var User = require('../models/userModel');
var Solicitud = require('../models/solicitudModel');

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
        res.status(404).send({
            message: 'No tienes permiso para realizar esta peticion.'
        });
    }
}

function getSolicitudes(req, res) {
    if (req.user.role == 'admin') {
        Solicitud.find({}, (err, solicitudes) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en la peticion!'
                });
            } else {
                if (!solicitudes) {
                    res.status(404).send({
                        type: 'err',
                        message: 'No solicitudes..'
                    });
                } else {
                    res.status(200).send({
                        solicitudes
                    });
                }
            }
        }).populate('_userId');
    } else {
        res.status(404).send({
            type: 'err',
            message: 'No tienes permiso para realizar esta peticion.'
        });
    }
}

function newOwner(req, res) {
    // Esta funcion convierte a un usuario cliente que solicitio ser dueño, en dueño. Utilizo el metodo post, y para que envie la cabecera
    // de autenticacion debo enviarle algo por body. Por eso envio el objeto y lo requiero aca en params= req.body, si no da error.
    var id = req.params.id;
    var params = req.body;
    var _id = params._id;
    console.log(_id);
    if (req.user.role == 'admin') {
        Solicitud.findOne({
            _id: id
        }, (err, solicitud) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en la peticion!'
                });
            } else {
                if (!solicitud) {
                    res.status(404).send({
                        type: 'err',
                        message: 'No encontramos la solicitud correspondiente..'
                    });
                } else {
                    var idUser = solicitud._userId;
                    User.findOne({
                        _id: solicitud._userId
                    }, (err, user) => {
                        if (err) {
                            res.status(500).send({
                                message: 'Error en la peticion!'
                            });
                        } else {
                            if (!user) {
                                res.status(404).send({
                                    type: 'err',
                                    message: 'No encontramos el usuario de la solicitud..'
                                });
                            } else {
                                user.role = 'owner';
                                user.clientData = null;
                                user.ownerData = {
                                    misComplejos: []
                                };
                                user.save((err, userStored) => {
                                    if (err) {
                                        return res.status(500).send({
                                            type: 'err',
                                            message: 'Error al guardar los nuevos datos del usuario..'
                                        });
                                    }
                                    solicitud.aceptedAt = Date.now();
                                    console.log(solicitud.aceptedAt);
                                    solicitud.save((err, solicitudStored) => {
                                        if (err) {
                                            return res.status(500).send({
                                                type: 'err',
                                                message: 'Error al guardar la fecha de aceptada la solicitud..'
                                            });
                                        }
                                        res.status(200).send({
                                            type: 'ok',
                                            message: 'Se modifico el usuario como nuevo dueño..'
                                        });
                                    });
                                });
                            }
                        }
                    });
                }
            }
        });
    } else {

    }
}

module.exports = {
    getUsers,
    getSolicitudes,
    newOwner
};