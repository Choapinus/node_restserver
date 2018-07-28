// Verificar token

const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    // res.json({
    //     token
    // });
    // si ponemos el res.json(), se enviara la respuesta y se corta la ejecucion de la funcion
    // en donde usamos el middleware a no ser que aqui se ocupe la funcion next()
    // el cual da paso al flujo normal del programa
    // para esta funcion, validamos el token con la libreria jsonwebtoken

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({ // 401: no autorizado
                // fijate que si obtiene error, retorna, por lo que la ejecucion del resto del codigo se ve truncada
                ok: false,
                err: {
                    message: "Token no valido"
                }
            });
        }

        req.usuario = decoded.usuario; // usuario sale desde el jwt.sign en el routes/login.js

        next();
    });
}

// Verifica admin rol

let verificaAdminRole = (req, res, next) => {

    let user = req.usuario; // ya debe estar autenticado, asi que req ya tiene el objeto usuario

    if (user.rol === 'ADMIN_ROLE') {
        next();

    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: "No tienes permisos de administrador v:<"
            }
        });
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}