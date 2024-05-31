const userService = require('../services/userServices');
const { encryptData, decryptData, verificarDatos, comparePassword } = require('../checkAutenticathed/authMiddleware');
const { findUserByEmail } = require('../models/userModel');

async function register(req, res) {
    const { dataSegura } = req.body;
    try {
        // Convertir dataSegura a una cadena JSON antes de encriptarla
        const dataSeguraJson = JSON.stringify(dataSegura);
        const dataSeguraEncriptada = encryptData(dataSeguraJson);
        console.log("La data encriptada es: ", dataSeguraEncriptada);

        // Registrar al usuario sin desencriptar datos en este punto
        await userService.registerUser(dataSegura.nombre, dataSegura.correo, dataSegura.contrasenia);
        res.status(201).send('Usuario registrado correctamente');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
}

async function loginUser(req, res) {
    const { dataSegura } = req.body;
    console.log("Esta es la data segura: ", dataSegura);

    try {
        // Convertir dataSegura a una cadena JSON antes de encriptarla
        const dataSeguraJson = JSON.stringify(dataSegura);
        const dataSeguraEncriptada = encryptData(dataSeguraJson);
        console.log("La data encriptada es: ", dataSeguraEncriptada);

        // Desencriptar la data segura
        const dataDesencriptada = decryptData(dataSeguraEncriptada);
        console.log("La data desencriptada es: ", dataDesencriptada);

        // Verificar los datos desencriptados
        const datos = verificarDatos(dataDesencriptada);
        const usuario = await _findUserByEmail(datos.correo);

        if (!usuario) {
            console.log('Usuario incorrecto');
            return res.status(404).send('Usuario o contraseña incorrectos');
        }

        const validPassword = await comparePassword(datos.contrasenia, usuario.contrasenia_hashed);
        if (!validPassword) {
            console.log('Contraseña incorrecta');
            return res.status(404).send('Usuario o contraseña incorrectos');
        } else {
            return res.status(200).json(usuario);
        }
    } catch (error) {
        console.error('Error al logear usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
}

async function _findUserByEmail(correo) {
    try {
        const usuario = await userService.findUserByEmail(correo);
        return usuario;
    } catch (error) {
        console.error('Error al obtener usuario por correo:', error);
        return error;
    }
}

async function encontrarUsuarioId(req, res) {
    const { id } = req.params;
    try {
        const user = await userService.findUserById(id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener información del usuario' });
    }
}

function logoutUser(req, res) {
    req.session.destroy((err) => {
        console.log("Se va a destruir la sesión");
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
}

module.exports = {
    register,
    loginUser,
    encontrarUsuarioId,
    logoutUser
};
