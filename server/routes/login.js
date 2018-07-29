// requires
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
// end requires

// util
const Usuario = require('../models/usuario');
const app = express();
// end util

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            console.log("error login");
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDB) { // aqui evaluamos el mail
            return res.status(500).json({
                ok: false,
                message: "(Usuario) o contraseña incorrectos"
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) { // aqui evaluamos la password
            return res.status(500).json({
                ok: false,
                message: "Usuario o (contraseña) incorrectos"
            });
        } else {

            let token = jwt.sign({
                usuario: userDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // expira en 30 dias

            return res.json({
                ok: true,
                user: userDB,
                token
            });
        }
    });
});


// Configuracion de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    }).catch(err => {
        // console.log(err);
    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: {
                    e, // imprime nada la wea
                    message: "Token no valido"
                }
            });
        });

    // primero, verificar que el usuario no exista con el correo recibido
    Usuario.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDB) { // si nunca se ha autenticado con su cuenta de google, deberiamos crear el usuario
            // primero revisar si esta autenticado por google
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: {
                        err: "Debe ocupar su autenticacion normal"
                    }
                });
            } else {
                // si se ha autenticado, debo renovar su token
                let token = jwt.sign({
                    usuario: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: userDB,
                    token
                });
            }

        } else { // ahora la condicion de que pasa si no existe este usuario en la DB (si es primera vez que se autentica)
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; // el pw es obligatorio, pero el google sign hace el sign, por lo tanto le ponemos cualquier cosa

            usuario.save((err, userDB) => {
                if (err) {
                    console.log("error db");
                    return res.status(400).json({
                        ok: false,
                        message: {
                            err,
                            errMsg: "No se pudo guardar usuario en la db"
                        }
                    });
                } else {
                    let token = jwt.sign({
                        usuario: userDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: userDB,
                        token
                    });
                }
            })
        }
    });
});



module.exports = app;