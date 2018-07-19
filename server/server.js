// require config
require('./config/config');

// require modules
const express = require('express');
const bodyParser = require('body-parser');

// declare app express
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

    if (body.nombre === undefined) {
        response.status(400).json({
            ok: false,
            msg: "Nombre es necesario"
        });
    } else {

        response.json({
            persona: body
        });
    }
    let id = request.params.id;
});

app.put('/usuario/:id', (request, response) => {
    response.json({
        id
    });
});

app.delete('/usuario', (request, response) => {
    response.json('delete Usuario');
});

// listen
app.listen(process.env.PORT, () => {
    console.log(`ascuchando puerto ${ process.env.PORT }`);
});