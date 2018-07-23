// ===================================
// ll			Puerto				ll
// ===================================

process.env.PORT = process.env.PORT || 8080;

// ===================================
// ll			Entorno				ll
// ===================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // si no existe, estoy en dev
//process.env.NODE_ENV es una variable que provee heroku

// ===================================
// ll			DataBase			ll
// ===================================

let urlDB;

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = 'mongodb://don_choppy:asdf1234@ds145911.mlab.com:45911/node_cafe';

// urlDB = 'mongodb://don_choppy:asdf1234@ds145911.mlab.com:45911/node_cafe'; // para probar remoto, descomentar
process.env.URLDB = urlDB; // se debe dejar de alguna manera accesible desde otros archivos