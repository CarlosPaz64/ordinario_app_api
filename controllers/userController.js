const userService = require('../services/userServices');
const { comparePassword, getHash } = require('../checkAutenticathed/authMiddleware');
const { findUserByEmail } = require('../models/userModel');

async function register(req, res) {
    const { nombre, apellidos, correo, contrasenia } = req.body;
    console.log("Datos del usuario por registrar: ", req.body); // Mensaje de depuración

    if (!contrasenia) {
        console.error('Contrasenia es undefined o null en el cuerpo de la solicitud');
        return res.status(400).send('La contraseña es requerida');
    }

    try {
        // Hashear la contraseña antes de registrar al usuario
        console.log('Contrasenia recibida para hashear:', contrasenia); // Mensaje de depuración
        const contraseniaHasheada = await getHash(contrasenia);
        console.log('Contrasenia hasheada:', contraseniaHasheada); // Mensaje de depuración

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

    console.log("Datos rebicidos del usuario: ", req.body);

    if (!correo || !contrasenia) {
        console.error('Uno de los datos es undefined');
        return res.status(400).send('Los datos no se están mandando por completo');
    }

    try {
        // Obtener el usuario por correo electrónico
        const usuario = await findUserByEmail(correo);

        if (!usuario) {
            console.log('Usuario incorrecto.');
            return res.status(404).send('Usuario incorrecto. Mensaje de la API');
        }

        // Depuración del proceso de comparación de contraseñas
        console.log("Contraseña ingresada en controlador: ", contrasenia);
        console.log("Contraseña almacenada en BD: ", usuario.contrasenia_hashed);
        const validPassword = await comparePassword(contrasenia, usuario.contrasenia_hashed);
        console.log("Resultado de comparación de contraseñas: ", validPassword);

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
