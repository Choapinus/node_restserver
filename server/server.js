// require config
require('./config/config');

// require modules
const express = require('express');
const mongoose = require('mongoose');

// declare app express
const app = express();

// gobal routes configuration
// app.use(require('./routes/usuario'));
// app.use(require('./routes/login'));
app.use(require('./routes/index')); // asi solo se importa un solo archivo que contenga todas las rutas


// mongo connect
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) {
        console.log('error mongo');
        throw err;
    }
    console.log("db online");
});


// listen
app.listen(process.env.PORT, () => {
    console.log(`ascuchando puerto ${ process.env.PORT }`);
});