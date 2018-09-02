/* jshint -W097, -W117, -W119, -W104 */
'use strict';
// Modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var Jimp = require('jimp');
var crypto = require('crypto'); // no hay que instalarlo por npm
var nodemailer = require('nodemailer');

// Servicios
var jwt = require('../services/jwt');
var mailer = require('../services/mailer');

// Modelos
var User = require('../models/userModel');
var EmailToken = require('../models/emailTokenModel');
var solicitudOwner = require('../models/solicitudModel');

// Acciones
// Por cada modelo creo un controlador el cual se va a encargar de realizar las funciones.
function pruebas(req, res) {
    res.status(200).send({
        message: "Probando controlador user!",
        user: req.user
    });
}

function registrarUser(req, res) {
    // Crear nuevo objeto de usuario
    var user = new User();
    // Recoger los parametros que llegan por body en la peticion
    var params = req.body;
    if (params.password && params.name && params.surname && params.email) {
        // Asignar valores al usuario menos contraseña que se asigna mas adelante encryptada.
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.image = 'profile.png';
        // user.role = 'client';
        // user.image = 'Null';
        // user.photoUrl = 'Null';
        // En estas sentencias preguntamos el rol del usuario para asignar propiedades que dependen si es
        // client o owner.
        if (user.role == 'client') {
            user.ownerData = null;
            user.clientData = {
                complejosFav: [],
                confiabilidad: Number,
                asistencias: Number
            };
            user.clientData.confiabilidad = 0;
            user.clientData.asistencias = 0;
            user.clientData.celular = '';
        }
        if (user.role == 'owner') {
            user.ownerData = {
                misComplejos: []
            };
            user.clientData = null;
        }
        // Aca en complejos favoritos o mis complejos debemos especificarle que el objeto
        // que va guardado es de tipo Complejo para poder hacer populate.
        if (user.role == 'admin') {
            user.ownerData = null;
            user.clientData = null;
        }
        // Al crear un usuario de forma local, le asigno el providers de facebook en nulo. Esta cuenta va a ser solo local..
        // Al crear un usuario de facebook, en este objeto estara su id de facebook que la api nos respondera si el usuario 
        // se loguea a travez de facebook.
        user.providers.facebook.uid = null;
        // Comprueba si el email existe en otro usuario, es decir si ya existe ese usuario. En caso
        // de que ya haya ese email nos devuelve un objeto User.
        User.findOne({
            email: user.email
        }, (err, userRepeat) => {
            if (err) {
                res.status(500).send({
                    message: "Error al comprobar el usuario"
                });
            } else {
                if (!userRepeat) {
                    // Si no existe el usuario en la BD lo guardo!
                    // Cifrar contrasena y asignarla
                    bcrypt.hash(params.password, null, null, function (err, hash) {
                        user.password = hash;
                    });
                    // Guardar el usuario en la BD.
                    user.save((err, userStored) => {
                        if (err) {
                            res.status(500).send({
                                message: "Error al guardar el usuario"
                            });
                        } else {
                            if (!userStored) {
                                res.status(404).send({
                                    message: "Error al registrar el usuario"
                                });
                            } else {
                                // Creo un objeto que contiene el id del usuario, un token y una fecha de expiracion(se asigna automatico en el modelo.) y lo guardo.
                                var emailtoken = new EmailToken({
                                    _userId: user._id,
                                    token: crypto.randomBytes(16).toString('hex')
                                });
                                emailtoken.save((err, emailTokenStored) => {
                                    if (err) {
                                        return res.status(404).send({
                                            message: "Error al crear el usuario."
                                        });
                                    } else {
                                        // Envio el mensaje que la cuenta se creo correctamente aca y no cuando el mail se envio y salio todo correcto porque demora unos segundos.
                                        // De aca en adelante lo que puede fallar es el tema del email con el link para activar cuenta!.
                                        res.status(200).send({
                                            type: "ok",
                                            message: 'Registro completo! Se envio un correo para activar la cuenta a: ' + user.email + '.'
                                        });
                                        // En el servicio mailer, estan las funciones par enviar mails, en este caso paso el mail al que enviar y el token de activacion, la funcion
                                        // crea el mail y lo envia. Devuelve ok si sale bien o err en caso contrario. El tema es que demora unos segundos en salir el email, por eso 
                                        // se informa al usuario que salio bien antes de enviar el email. En caso que al usuario no le llegue mail puede solicitarlo de nuevo.
                                        // mailer.emailBienvenida(userStored.email, emailTokenStored.token, (err) => {
                                        //     if (err.type == 'err') {
                                        //         return res.status(404).send({
                                        //             message: "Error al crear el usuario."
                                        //         });
                                        //     } else {
                                        //         res.status(200).send({
                                        //             type: "ok",
                                        //             message: 'Registro completo! Se envio un correo para activar la cuenta a: ' + user.email + '.'
                                        //         });
                                        //     }
                                        // });
                                    }
                                });
                            }
                        }
                    });
                } else {
                    res.status(200).send({
                        message: "La dirección de correo electronico que has puesto ya está asociada a otra cuenta."
                    });
                }
            }
        });
    } else {
        res.status(200).send({
            message: "Introduce los datos correctamente"
        });
    }
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    // Busca si existe algun usuario con ese email.
    User.findOne({
        email: email
    }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: "Error al comprobar el usuario"
            });
        } else {
            if (user) {
                // Si existe comprueba que la contrasena ingresada sea corecta
                // Si esta todo ok devuelve el objeto user.
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        // Comprobar si se requiere el token y generar
                        if (params.gettoken) {
                            // Devolver token jwt
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }
                        if (!user.isVerified) {
                            return res.status(404).send({
                                type: "No verificado",
                                message: "Tu cuenta aun no ah sido verificada, revisa tu email con el link de confirmacion."
                            });
                        }
                        // Devolver datos de usuario
                        res.status(200).send({
                            user
                        });
                    } else {
                        res.status(404).send({
                            message: "Contraseña incorrecta"
                        });
                    }
                });

            } else {
                res.status(404).send({
                    message: "No se encuentrar registros con ese email"
                });
            }
        }
    });
}

function loginFacebook(req, res) {
    var params = req.body; // parametros que llegan por request desde facebook.
    var email = params.email; // email de facebook
    var userFaceId = params.id; // id de facebook.
    var newUser = new User();
    // Puede pasar que el id venga vacio en la request, y al entrar a la consulta nos retorna un usuario incorrecto.
    // por eso cuestionamos si el id es != de undefined. En caso de entrar, comprueba si existe ese FacebookId en 
    // algun usuario, si es asi lo retorna, en caso que no va a comprobar que el email no se este usando en una 
    // cuenta local, y si no se lo esta usando va a crear un usuario con los datos que nos proporciona facebook. 
    if (userFaceId != undefined) {
        User.findOne({
            'providers.facebook.uid': userFaceId
        }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    message: "Error al comprobar el usuario"
                });
            } else {
                if (user) {
                    // Aca encontro el faceId en un usuario y lo devuelve junto con el token como un login normal. 
                    return res.status(200).send({
                        user: user,
                        token: jwt.createToken(user)
                    });
                } else {
                    // Aca va a comprobar que el email no este en uso. En caso que este libre crea el usuario con
                    // datos de face. En otro caso devuelve un mensaje informando que ya hay una cuenta local
                    // com ese email
                    User.findOne({
                        'email': email
                    }, (err, user) => {
                        if (err) {
                            return res.status(500).send({
                                message: "Error al comprobar el usuario"
                            });
                        } else {
                            if (user) {
                                // Si encontro usuario es porque ese email esta en uso.
                                return res.status(404).send({
                                    message: "El email ya esta en uso en una cuenta local, ingresa email y contraseña para iniciar sesion.",
                                });
                            } else {
                                // No encontro usuaio, ni faceId ni email estan siendo usados en algun usuario. 
                                if (params.name && params.email && params.id) {
                                    newUser.name = params.name;
                                    newUser.surname = '';
                                    newUser.email = params.email;
                                    //newUser.role = 'client';
                                    //newUser.image = 'Null';
                                    if (params.photoUrl) {
                                        newUser.photoUrl = params.photoUrl;
                                    }
                                    // En estas sentencias preguntamos el rol del usuario para asignar propiedades que dependen si es
                                    // client o owner.
                                    if (newUser.role == 'client') {
                                        newUser.ownerData = null;
                                        newUser.clientData = {
                                            complejosFav: [],
                                            confiabilidad: Number,
                                            asistencias: Number,
                                            celular: String
                                        };
                                        newUser.clientData.confiabilidad = 0;
                                        newUser.clientData.asistencias = 0;
                                        newUser.clientData.celular = '';
                                    }
                                    newUser.isVerified = true;
                                    newUser.providers.facebook.uid = params.id;
                                    // Guardar el usuario en la BD.
                                    newUser.save((err, userStored) => {
                                        if (err) {
                                            return res.status(500).send({
                                                message: "Error al guardar el usuario"
                                            });
                                        } else {
                                            if (!userStored) {
                                                return res.status(404).send({
                                                    message: "Error al registrar el usuario"
                                                });
                                            } else {
                                                return res.status(200).send({
                                                    user: userStored,
                                                    token: jwt.createToken(userStored)
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    return res.status(404).send({
                                        message: "Error en los datos de Facebook. Intente nuevamente.",
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    } else {
        return res.status(404).send({
            message: "Error en los datos de Facebook. Intente nuevamente.",
        });
    }
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    // A update le borro la password para no actualizarla cuando actualizo el usuario. Recordar que en el frontend \
    // mantengo la session con el usuario en el Lstorage y le vacio la contraseña.
    delete update.password;

    // compruebo si el id del usuario que viene por parametros es igual al del usuario que vino
    // por el token, osea el que esta logueado.
    if (userId != req.user.sub) {
        return res.status(500).send({
            message: 'No tienes permiso para actualizar el usuario'
        });
    } else {
        // Esta funcion recibe el id del usuario a actualizar y un objeto con los datos a actualizar
        // puede ser uno o todos los atributos del user. Esta funcion devuelve el objeto antes
        // de actualizar. Para que devuelva el nuevo objeto actualizado hay que ponerle un tercer
        // parametro { new:true }.
        User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
            if (err) {
                res.status(500).send({
                    message: 'Error al actualizar usuario'
                });
            } else {
                if (!userUpdated) {
                    res.status(404).send({
                        message: 'No se pudo actualizar usuario'
                    });
                } else {
                    res.status(200).send({
                        user: userUpdated
                    });
                }
            }
        });
    }
}

function uploadImage(req, res) {
    // Esta funcion carga la imagen a un usuario y a la vez elimina la imagen que tenia asignada
    // anteriormente. Para esto lo que hacemos en obtener el path del file que viene en la peticion
    // lo separamos hasta obtener la ultima parte que es el nombre de la imagen en si. En este caso
    // el path es uploads/users/nombreiImagen.jpg . Esto ultimo es lo que asignamos al usuario.
    // Para esto la imagen ya esta cargada al sv, por eso en caso de que la extension del file 
    // no sea del tipo especificado sera eliminado. Y al estar todo OK se elimina la imagen anterior
    // para eso la consulta findByIdAndUpdate nos devuelve el usuario viejo, es decir con la imagen
    // anterior, y concatenamos el path file original con esta imagen anterior para obtener la ruta
    // a la imagen vieja para eliminar.
    var userId = req.params.id;
    var file_name = 'No subido';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/'); // Separa las partes del file, en la 2 esta el nombre de la imagen con .extension
        file_name = file_split[2];

        var ext_split = file_name.split('\.'); // Obtiene solo la extension de la imagen
        var file_ext = ext_split[1];
        // Esta funcion lee la nueva ruta de la imagen, la deja cuadrada y comprime. la guarda en la misma ruta.
        var imagenForResize = './uploads/users/' + file_name;
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'JPG' || file_ext == 'jpeg') {
            Jimp.read(imagenForResize, function (err, image) {
                if (err) {
                    // console.log(error);
                } else {
                    image.cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).write(imagenForResize);
                }
            });
            User.findByIdAndUpdate(userId, {
                $set: {
                    image: file_name,
                    photoUrl: 'Null'
                }

            }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar imagen'
                    });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({
                            message: 'No se ah podido actualizar la imagen'
                        });
                    } else {
                        // Aca se concatena la ruta y se le agrega el nombde de la imagen vieja, recordar que el userU es el viejo. 
                        // Por defecto asignamos una imagen de perfil, aca vamos a asignar null si la imagen es esa por defecto, ya
                        // que si no la va a eliminar y es usada por todos los usuarios al principio.
                        var imagenABorrar = null;
                        if (userUpdated.image != 'profile.png') {
                            imagenABorrar = userUpdated.image;
                        }
                        var borrar = './uploads/users/' + imagenABorrar;
                        fs.unlink(borrar, (err) => {
                            if (err) {
                                res.status(200).send({
                                    message: 'Imagen actualizada pero imagen vieja no eliminada',
                                    newImage: file_name,
                                    user: userUpdated
                                });
                            } else {
                                res.status(200).send({
                                    message: 'Imagen actualizada e imagen vieja eliminada',
                                    newImage: file_name,
                                    user: userUpdated
                                });
                            }
                        });
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(404).send({
                        message: 'Extension no valida y fichero no borrado'
                    });
                } else {
                    res.status(404).send({
                        message: 'Extension del archivo no valido'
                    });
                }
            });

        }
    } else {
        res.status(404).send({
            message: 'No ah subido ninguna imagen'
        });
    }
}

function getImage(req, res) {
    // Recibe por params el nombre de la imagen del usuario, en pathFile concatena la ruta
    // de la carpeta donde estan las imagenes con el nombre que recibe por parametros. fs.exist
    // es true si esa ruta existe en el directorio del sv. En caso que sea true devuelve la imagen
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/' + imageFile;
    fs.exists(pathFile, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send({
                message: 'No existe la imagen'
            });
        }
    });
}

function tokenConfirmation(req, res) {
    var tokenn = req.params.token;
    if (tokenn == null) {
        return res.status(404).send({
            type: 'No verificado',
            message: 'Error al verificar la cuenta, intente nuevamente.'
        });
    } else {
        // Find a matching token
        EmailToken.findOne({
            token: tokenn
        }, function (err, token) {
            if (err) return res.status(400).send({
                type: 'No verificado',
                message: 'No podemos activar la cuenta. Error en el servidor, intente nuevamente.'
            });
            if (!token) return res.status(400).send({
                type: 'No verificado',
                message: 'No podemos activar la cuenta. Quizas haya expirado el tiempo para la activacion.'
            });
            // If we found a token, find a matching user
            User.findOne({
                _id: token._userId
            }, function (err, user) {
                if (err) return res.status(400).send({
                    type: 'No verificado',
                    message: 'No podemos activar la cuenta. Error en el servidor, intente nuevamente.'
                });
                if (!user) return res.status(400).send({
                    type: 'No verificado',
                    message: 'No podemos encontrar un usuario para esta activacion.'
                });
                if (user.isVerified) return res.status(400).send({
                    type: 'verificado',
                    message: 'Este usuario ya fue verificado.'
                });
                // Verify and save the user
                user.isVerified = true;
                user.save(function (err) {
                    if (err) {
                        return res.status(500).send({
                            type: 'No verificado',
                            message: 'No podemos verificar el usuario, intenta nuevamente.'
                        });
                    }
                    res.status(200).send({
                        type: 'verificado',
                        message: 'Cuenta activada correctamente! Ya puedes utilizar Cancha Facil.'
                    });
                });
            });
        });
    }
}

function resendEmailToken(req, res) {
    // Funcion para reenviar un token de actvacion de cuenta. Esto recibe un email por parametros y comprueba si hay un usuario sin verificar con ese email
    // en caso correcto genera un nuevo token y lo envia al email del usuario. 
    var emaill = req.params.email;
    if (emaill == null) {
        return res.status(404).send({
            type: 'error',
            message: 'Error al enviar codigo de activacion, intente nuvamente.'
        });
    } else {
        User.findOne({
            email: emaill
        }, function (err, user) {
            if (err) {
                return res.status(500).send({
                    type: 'error',
                    message: 'Error al enviar codigo de activacion, intente nuevamente.'
                });
            } else {
                if (!user) return res.status(400).send({
                    type: 'error',
                    message: 'No podemos encontrar una cuenta con ese email, comprueba que has escrito correctamente.'
                });
                if (user.isVerified) return res.status(200).send({
                    type: 'activada',
                    message: 'Esta cuenta ya esta activada, puedes Iniciar Sesion'
                });
                // creamos un nuevo token, lo guardamos en la bd y enviamos link por correo para la activacion.
                var emailtoken = new EmailToken({
                    _userId: user._id,
                    token: crypto.randomBytes(16).toString('hex')
                });
                emailtoken.save(function (err, emailTokenStored) {
                    if (err) {
                        return res.status(500).send({
                            type: 'error',
                            message: 'Error al enviar codigo de activacion, intente nuvamente.'
                        });
                    } else {
                        // Envio el res aca y no mas adelante para que no demore en mostrar una respuesta en el front, enviar el mail lleva unos segundos.
                        // Puede fallar y que no se envie el mail.
                        res.status(200).send({
                            type: "ok",
                            message: 'Se envio un correo para activar la cuenta a: ' + user.email + '.'
                        });
                        mailer.reenviarToken(user.email, emailTokenStored.token, (err) => {
                            if (err.type == 'err') {
                                return res.status(404).send({
                                    message: "Error al enviar mail."
                                });
                            } else {
                                res.status(200).send({
                                    type: "ok",
                                    message: 'Registro completo! Se envio un correo para activar la cuenta a: ' + user.email + '.'
                                });
                            }
                        });
                    }

                });
            }
        });
    }
}

function solicitudForOwner(req, res) {
    // Esta funcion permite al usuario Cliente, poder enviar una solicitud para converstirse en usuario Dueño. 
    // Se comprueba que el usuario es de tipo Cliente, luego que no tiene esta solicitud pendiente y si se coumplen
    // estas anteriores se crea una nueva solicitud.
    var id = req.params.id;
    if (id == null) {
        res.status(404).send({
            type: 'err',
            message: 'Error, cierre sesion e intente nuevamente.'
        });
    } else {
        User.findOne({
            _id: id
        }, (err, user) => {
            if (err) {
                return res.status(404).send({
                    type: 'err',
                    message: 'Error en el servidor, intente nuevamente.'
                });
            } else {
                if (!user) return res.status(400).send({
                    type: 'err',
                    message: 'No podemos enviar la solicitud, comunicarse con un administrador.'
                });
                if (user.role == 'client') {
                    solicitudOwner.findOne({
                        _userId: user._id
                    }, (err, userRepeat) => {
                        if (err) {
                            return res.status(404).send({
                                type: 'err',
                                message: 'Error en el servidor, intente nuevamente.'
                            });
                        } else {
                            if (!userRepeat) {
                                var solicitud = new solicitudOwner({
                                    _userId: user._id,
                                });
                                solicitud.save(function (err, solicidudStored) {
                                    if (err) {
                                        return res.status(404).send({
                                            type: 'err',
                                            message: 'Error al enviar la solicitud.'
                                        });
                                    } else {
                                        if (!solicidudStored) return res.status(400).send({
                                            type: 'err',
                                            message: 'No podemos enviar la solicitud, intente nuevamente'
                                        });
                                        res.status(200).send({
                                            type: "ok",
                                            message: 'Se envio la solicitud para poder crear y administrar su complejo, nos contactaremos con usted.'
                                        });
                                    }
                                });
                            } else {
                                return res.status(200).send({
                                    type: 'okno', 
                                    message: 'Ya tenemos una solicitud de su parte, nos comunicamos a la brevedad.'
                                });
                            }
                        }
                    });
                } else {
                    return res.status(404).send({
                        type: 'err',
                        message: 'Usted ya es dueño de una cancha.'
                    });
                }
            }
        });
    }
}

module.exports = {
    pruebas,
    registrarUser,
    loginUser,
    loginFacebook,
    updateUser,
    uploadImage,
    getImage,
    tokenConfirmation,
    resendEmailToken,
    solicitudForOwner
};