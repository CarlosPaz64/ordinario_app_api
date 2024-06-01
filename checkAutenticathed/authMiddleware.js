const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
const privateKey = process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n');

function generateToken(data, expirationTime) {
    return jwt.sign({ data }, privateKey, { algorithm: 'RS256', expiresIn: expirationTime });
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
