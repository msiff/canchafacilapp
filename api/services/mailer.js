/* jshint -W097, -W117, -W119, -W104 */
var nodemailer = require('nodemailer');

// Send the email, corregir los datos para usar el email de cancha facil y la ruta a la api.
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cmiguelsiffredo@gmail.com',
        pass: 'miguel13314'
    }
});
// Direccion de cancha Facil
var url = "http://localhost:4200/";

// Funcion para enviar mail de bienvenida, necesita el correo del usuario a registrar.
function emailBienvenida(email, emailTokenStored) {
    var mailOptions = {
        from: 'Cancha Facil',
        to: email,
        subject: 'Bienvenido a Cancha Facil! Activa tu cuenta.',
        html: '<p>Hola!</p><p>Por favor confirma tu cuenta para poder utilizar Cancha Facil.</p><p>Haz click en el siguiente enlace:' + url + 'confirmar-cuenta/' + emailTokenStored + '</p>'
    };
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return {
                type: 'err',
                message: 'Error al intentar enviar el email.'
            };
        } else {
            return {
                type: 'ok',
                message: 'Registro completo! Se envio un correo para activar la cuenta a: ' + email + '.'
            };
        }
    });
}

function reenviarToken(email, emailTokenStored) {
    var mailOptions = {
        from: 'Cancha Facil',
        to: email,
        subject: 'Bienvenido a Cancha Facil! Activa tu cuenta.',
        html: '<p>Hola!</p><p>Por favor confirma tu cuenta para poder utilizar Cancha Facil.</p><p>Haz click en el siguiente enlace:' + url + 'confirmar-cuenta/' + emailTokenStored + '</p>'
    };
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return {
                type: 'err',
                message: 'Error al intentar enviar el email.'
            };
        } else {
            return {
                type: 'ok',
                message: 'Registro completo! Se envio un correo para activar la cuenta a: ' + email + '.'
            };
        }
    });
}

module.exports = {
    emailBienvenida,
    reenviarToken
};