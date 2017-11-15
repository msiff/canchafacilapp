/* jshint -W097, -W117, -W119, -W104 */
'use strict';
// Modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

// Servicios
var jwt = require('../services/jwt');

// Modelos
var User = require('../models/userModel');

// Acciones
// Por cada modelo creo un controlador el cual se va a encargar de realizar las funciones.
function pruebas( req, res) {
    res.status(200).send({message: "Probando controlador user!", user: req.user});
}

function registrarUser(req, res) {
    // Crear nuevo objeto de usuario
    var user = new User();
    // Recoger los parametros que llegan por body en la peticion
    var params = req.body;
    if(params.password && params.name && params.surname && params.email) {
        // Asignar valores al usuario menos contraseña que se asigna mas adelante encryptada.
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'client';
        user.image = 'Null';
        // En estas sentencias preguntamos el rol del usuario para asignar propiedades que dependen si es
        // client o owner.
        if (user.role == 'client') {
            user.ownerData = null;
            user.clientData = { complejosFav: [], confiabilidad: Number, asistencias: Number, celular: String};
            user.clientData.confiabilidad = 0;
            user.clientData.asistencias = 0;
            user.clientData.celular = '';
        }
        if (user.role == 'owner') {
            user.ownerData = { misComplejos: [] };
            user.clientData = null;
        }
        // Aca en complejos favoritos o mis complejos debemos especificarle que el objeto
        // que va guardado es de tipo Complejo para poder hacer populate.
        if (user.role == 'admin') {
            user.ownerData = null;
            user.clientData = null;
        }
        // Comprueba si el email existe en otro usuario, es decir si ya existe ese usuario. En caso
        // de que ya haya ese email nos devuelve un objeto User.
        User.findOne({email: user.email}, (err, userRepeat) => {
            if (err) {
                res.status(500).send({message: "Error al comprobar el usuario"});
            } else {
                if (!userRepeat) {
                    // Si no existe el usuario en la BD lo guardo!
                    // Cifrar contrasena y asignarla
                    bcrypt.hash(params.password, null, null, function(err, hash) {
                        user.password = hash;
                    });
                    // Guardar el usuario en la BD.
                    user.save( (err, userStored) => {
                        if (err) {
                            res.status(500).send({message: "Error al guardar el usuario"});
                        } else {
                            if (!userStored) {
                                res.status(404).send({message: "Error al registrar el usuario"});
                            } else {
                                res.status(200).send({user: userStored});
                            }
                        }
                    });
                } else {
                    res.status(200).send({message: "El usuario no puede registrarse porque ese email esta en uso"});
                }
            }
        });
    } else {
        res.status(200).send({message: "Introduce los datos correctamente"});
    }
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    // Busca si existe algun usuario con ese email.
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            res.status(500).send({message: "Error al comprobar el usuario"});
        } else {
            if (user) {
                // Si existe comprueba que la contrasena ingresada sea corecta
                // Si esta todo ok devuelve el objeto user.
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        // Comprobar si se requiere el token y generar
                        if (params.gettoken) {
                            // Devolver token jwt
                            res.status(200).send({ token: jwt.createToken(user) });
                        } else {
                            // Devolver datos de usuario
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({message: "Contrasena incorrecta"});
                    }
                });
                
            } else {
                res.status(404).send({message: "No se encuentrar registros con ese email"});
            }
        }
    });
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
        return res.status(500).send({message: 'No tienes permiso para actualizar el usuario'});
    } else {
        // Esta funcion recibe el id del usuario a actualizar y un objeto con los datos a actualizar
        // puede ser uno o todos los atributos del user. Esta funcion devuelve el objeto antes
        // de actualizar. Para que devuelva el nuevo objeto actualizado hay que ponerle un tercer
        // parametro { new:true }.
        User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
            if (err) {
                res.status(500).send({message: 'Error al actualizar usuario'});
            } else {
                if (!userUpdated) {
                    res.status(404).send({message: 'No se pudo actualizar usuario'});
                } else {
                    res.status(200).send({user: userUpdated});
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
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'JPG' || file_ext == 'jpeg') {
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({message: 'Error al actualizar imagen'});
                } else {
                    if (!userUpdated) {
                        res.status(404).send({message: 'No se ah podido actualizar la imagen'});
                    } else {
                        // Aca se concatena la ruta y se le agrega el nombde de la imagen vieja
                        var borrar = './uploads/users/' + userUpdated.image;
                        fs.unlink(borrar, (err) => {
                            if (err) {
                                res.status(200).send({message: 'Imagen actualizada pero imagen vieja no eliminada', newImage: file_name, user: userUpdated});
                            } else {
                                res.status(200).send({message: 'Imagen actualizada e imagen vieja eliminada', newImage: file_name, user: userUpdated});
                            }
                        });
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(404).send({message: 'Extension no valida y fichero no borrado'});
                } else {
                    res.status(404).send({message: 'Extension del archivo no valido'});
                }
            });
            
        }
    } else {
        res.status(404).send({message: 'No ah subido ninguna imagen'});
    }
}

function getImage(req, res) {
    // Recibe por params el nombre de la imagen del usuario, en pathFile concatena la ruta
    // de la carpeta donde estan las imagenes con el nombre que recibe por parametros. fs.exist
    // es true si esa ruta existe en el directorio del sv. En caso que sea true devuelve la imagen
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/' + imageFile;
    fs.exists(pathFile, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send({message: 'No existe la imagen'});
        }
    });
}

function getCuidadores(req, res) {
    User.find({role:'ROLE_ADMIN'}).exec((err, users) => {
        if (err) {
            res.status(500).send({message: 'Error en la peticion!'});
        } else {
            if (!users) {
                res.status(404).send({message: 'No hay cuidadores'});
            } else {
                res.status(200).send({users});
            }
        }
    });
}

module.exports = { pruebas, registrarUser, loginUser, updateUser, uploadImage, getImage, getCuidadores };