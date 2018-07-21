// requires
const express = require('express');
const bodyParser = require('body-parser');

// models
const Usuario = require('../models/usuario');

// app
const app = express();

// use body-parser to parse everything
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// services
app.get('/usuario', (request, response) => {
    response.json('get Usuario');
});

app.post('/usuario', (request, response) => {
    let body = request.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.correo,
        password: body.password,
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

        response.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.put('/usuario/:id', (request, response) => {
    response.json({
        id
    });
});

app.delete('/usuario', (request, response) => {
    response.json('delete Usuario');
});

module.exports = app;