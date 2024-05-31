const userService = require('../services/userServices');
const { comparePassword, getHash } = require('../checkAutenticathed/authMiddleware');
const { findUserByEmail } = require('../models/userModel');

async function register(req, res) {
    const { nombre, apellidos, correo, contrasenia } = req.body;
    try {
        // Hashear la contraseña antes de registrar al usuario
        const contraseniaHasheada = await getHash(contrasenia);

        // Registrar al usuario con la contraseña hasheada
        await userService.registerUser(nombre, apellidos, correo, contraseniaHasheada);
        res.status(201).send('Usuario registrado correctamente');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
}


async function loginUser(req, res) {
    // Obtener credenciales del cuerpo de la solicitud
    const { correo, contrasenia } = req.body;

    try {
        // Obtener el usuario por correo electrónico
        const usuario = await findUserByEmail(correo);

        if (!usuario) {
            console.log('Usuario incorrecto');
            return res.status(404).send('Usuario incorrecto');
        }

        // Comparar la contraseña ingresada con la contraseña almacenada
        const validPassword = await comparePassword(contrasenia, usuario.contrasenia_hashed);

        if (!validPassword) {
            console.log('Contraseña incorrecta');
            return res.status(404).send('Contraseña incorrecta');
        }

        // Si las credenciales son válidas, devolver el usuario
        return res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al logear usuario:', error);
        return res.status(500).send('Error interno del servidor');
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
