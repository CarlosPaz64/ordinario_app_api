const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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

function verificarDatos(dataSegura) {
    if (typeof dataSegura !== 'string') {
        console.error('Error: dataSegura no es una cadena', dataSegura);
        throw new TypeError('dataSegura debe ser una cadena');
    }
    
    let partes = dataSegura.split(',');
    let resultado = {};

    partes.forEach((parte, index) => {
        resultado[index === 0 ? 'nombre' : index === 1 && partes.length > 2 ? 'email' : 'password'] = decryptData(parte);
    });

    return resultado;
}

// Función para descifrar datos encriptados
function decryptData(encryptedText) {
    // Se obtiene la clave privada AES del entorno y se convierte en un buffer
    const key = Buffer.from(process.env.AES_PRIVATE_KEY, 'hex');
    // Se divide el texto encriptado en partes: IV (vector de inicialización), AuthTag (etiqueta de autenticación) y texto encriptado
    const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
    // Se convierte el IV en un buffer
    const iv = Buffer.from(ivHex, 'hex');
    // Se convierte la AuthTag en un buffer
    const authTag = Buffer.from(authTagHex, 'hex');
    // Se crea un descifrador usando el algoritmo AES-256-GCM, la clave y el IV
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    // Se establece la AuthTag para verificar la autenticidad del mensaje
    decipher.setAuthTag(authTag);
    // Se descifra el texto encriptado y se convierte a formato UTF-8
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    // Se devuelve el texto descifrado
    return decrypted;
}

async function comparePassword(passwordString, bdHash) {
    const compareHashes = await bcrypt.compare(passwordString, bdHash);
    return compareHashes;
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

function encryptData(data) {
    const key = Buffer.from(process.env.AES_PRIVATE_KEY, 'hex');
    if (key.length !== 32) {
        throw new Error('La longitud de la clave AES debe ser de 32 bytes.');
    }
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const jsonData = JSON.stringify(data); // Convertir el objeto a una cadena JSON
    let encrypted = cipher.update(jsonData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + cipher.getAuthTag().toString('hex') + ':' + encrypted;
}

async function getHash(passwordString) {
    const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);
    const password_hash = await bcrypt.hash(passwordString, saltRounds);
    return password_hash;
}

module.exports = {
    verificarToken,
    verificarDatos,
    comparePassword,
    checkAuthenticated,
    checkNotAuthenticated,
    generateToken,
    encryptData,
    decryptData,
    getHash
};
