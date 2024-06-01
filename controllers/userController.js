const userService = require('../services/userServices');
const { comparePassword, getHash, generateToken } = require('../checkAutenticathed/authMiddleware');
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
    const { correo, contrasenia } = req.body;
    console.log('Este es el cuerpo de la solicitud: ', req.body);

    // Verifica si se proporcionaron correo y contraseña
    if (!correo || !contrasenia) {
        return res.render('login', { error: 'Correo y contraseña son requeridos.' });
    }

    try {
        // Intenta encontrar al usuario por correo electrónico
        const usuario = await findUserByEmail(correo);

        // Si el usuario no se encontró, responde con un error
        if (!usuario) {
            return res.status(404).send('Usuario o contraseña incorrectos');
        }

        // Verificar la contraseña
        const validPassword = await comparePassword(contrasenia, usuario.contrasenia_hashed);
        if (!validPassword) {
            return res.status(404).send('Usuario o contraseña incorrectos');
        }

        // Generar token si el usuario y la contraseña son correctos
        const token = generateToken({ userId: usuario.id }, '1h');
        console.log("El id del usuario: ", usuario.id);
        console.log('Token generado y enviado al cliente:', token);

        // Enviar token al cliente en la respuesta
        return res.status(200).json({ token });

    } catch (error) {
        console.error('Error durante el proceso de inicio de sesión:', error);
        if (!res.headersSent) {
            return res.render('login', { error: 'Error al iniciar sesión. Inténtalo de nuevo.' });
        }
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
