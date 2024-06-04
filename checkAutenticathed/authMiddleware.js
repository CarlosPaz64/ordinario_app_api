// Archivo de verificación y autenticación del usuario
const dotenv = require('dotenv'); // Variables del entorno
const jwt = require('jsonwebtoken'); // Llamada a JWT
const bcrypt = require('bcrypt'); // Llamada al brcypt para la proteccion del usuario y sus datos 
dotenv.config();

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

// Reemplazar los \n por saltos de línea reales
const privateKey = process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n'); // Sirve para que tome el valor puro de la clave RSA

function generateToken(data, expirationTime) {
    return jwt.sign({ data }, privateKey, { algorithm: 'RS256', expiresIn: expirationTime }); // Genera el token y el tiempo de vida del mismo
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
    comparePassword,
    generateToken,
    getHash
};
