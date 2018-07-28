// ===================================
// ||			Puerto				||
// ===================================

process.env.PORT = process.env.PORT || 8080;

// ===================================
// ||			Entorno				||
// ===================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // si no existe, estoy en dev
//process.env.NODE_ENV es una variable que provee heroku

// ===================================
// ||			DataBase			||
// ===================================

let urlDB;

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = process.env.MONGO_URI; // variable de entorno puesta por ti con heroku config:set varname="" via CLI

// urlDB = process.env.MONGO_URI; // para probar remoto, descomentar
process.env.URLDB = urlDB; // se debe dejar de alguna manera accesible desde otros archivos


// ===================================
// ||      Vencimiento de token	    ||
// ===================================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===================================
// ||     Seed de autenticacion	    ||
// ===================================

process.env.SEED = process.env.SEED || 'seed-dev';