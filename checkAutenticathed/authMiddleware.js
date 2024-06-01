const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
dotenv.config();

function verificarToken(req, res, next) {
    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.RSA_PRIVATE_KEY, { algorithm: 'RS256' }, (err, usuario) => {
        if (err) {
            return res.status(403).json({ mensaje: 'Token inválido' });
        }
        req.usuario = usuario;
        next();
    });
}

async function comparePassword(passwordString, bdHash) {
    console.log("Contraseña ingresada en comparePassword:", passwordString);
    console.log("Contraseña en BD en comparePassword:", bdHash);

    try {
        // Compara la contraseña ingresada con la contraseña almacenada en forma de hash
        const compareHashes = await bcrypt.compare(passwordString, bdHash);
        console.log("Resultado de comparación de contraseñas en comparePassword:", compareHashes);
        return compareHashes;
    } catch (error) {
        console.error("Error al comparar contraseñas:", error);
        throw error;
    }
}




function checkAuthenticated(req, res, next) {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.RSA_PRIVATE_KEY, (err, decoded) => {
            if (err) {
                console.log('JWT no válido, redirigiendo a /login');
                return res.redirect('/login');
            }
            req.userId = decoded.userId;
            console.log('Usuario autenticado con JWT:', decoded.userId);
            next();
        });
    } else {
        console.log('Usuario no autenticado, redirigiendo a /login');
        res.redirect('/login');
    }
}

function checkNotAuthenticated(req, res, next) {
    if (!req.session.userId && !req.userId) {
        console.log('Usuario no autenticado');
        return next();
    }
    console.log('Usuario ya autenticado, redirigiendo a /');
    res.redirect('/');
}

function generateToken(data, expirationTime) {
    return jwt.sign({ data }, process.env.RSA_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: expirationTime });
}

async function getHash(passwordString) {
    const saltRounds = 10; // Valor fijo de 10 saltos
    console.log('Password string:', passwordString); // Mensaje de depuración para la contraseña
    console.log('Salt rounds:', saltRounds); // Mensaje de depuración para los saltos

    if (!passwordString) {
        throw new Error('La contraseña es undefined o null');
    }

    const password_hash = await bcrypt.hash(passwordString, saltRounds);
    return password_hash;
}



module.exports = {
    verificarToken,
    comparePassword,
    checkAuthenticated,
    checkNotAuthenticated,
    generateToken,
    getHash
};
