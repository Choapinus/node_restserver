// requires
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const _ = require('underscore'); // guion bajo por standart

// models
const Usuario = require('../models/usuario');

// app
const app = express();

// use body-parser to parse everything
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// services
app.get('/usuario', (request, response) => {
    // retornar registros paginados

    let desde = Number(request.query.desde) || 0;
    // request.query tambien viene desde la uri, pero con estructura de url:8080/user?desde=12
    let limite = Number(request.query.limite) || 5;

    Usuario.find({}) // el find trae todos los registros
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => { // el exec dira como ejecutar el find
            if (err) {
                response.status(400).json({
                    err
                });
            }

            response.json({
                ok: true,
                usuarios
            })
        });
});

app.post('/usuario', (request, response) => {
    let body = request.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    });

    // guardar en la bd

    usuario.save((err, usuarioDB) => {
        if (err) {
            console.log("error save");
            return response.json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null; // no elimina el campo del objeto y aparecera como password: null
        // tampoco se puede borrar con delete usuarioDB.password;
        // asi que se hace desde el schema

        response.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.put('/usuario/:id', (request, response) => {

    let id = request.params.id; // params viene de la uri
    // let body = request.body; // faltan validaciones
    let body = _.pick(request.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // sacar weas que no quieres que cambien, pero existe una libreria para hacerlo mejor
    // delete body.password;
    // delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userdb) => {
        if (err) {
            return response.status(400).json({
                ok: false,
                err
            });
        }

        response.json({
            ok: true,
            user: userdb
        });

    })

});

app.delete('/usuario', (request, response) => {
    response.json('delete Usuario');
});

module.exports = app;