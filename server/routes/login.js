// requires
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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




module.exports = app;