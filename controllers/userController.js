const userService = require('../services/userServices');
const authMiddleware = require('../checkAutenticathed/authMiddleware');
const { findUserByEmail } = require('../models/userModel');

async function register(req, res) {
    const { dataSegura } = req.body;
    try {

        let datos = authMiddleware.verificarDatos(dataSegura);

        await userService.registerUser(datos.nombre, datos.email, datos.password);
        res.status(201).send('Usuario registrado correctamente');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
}

async function loginUser(req, res) {
    const { dataSegura } = req.body;

    try {
        let datos = authMiddleware.verificarDatos(dataSegura);
        const usuario = await _findUserByEmail(datos.correo);

        if(!usuario){
            res.status(404).send('Usuario o contraseña incorrectos');
        }

        let validPassword = await authMiddleware.comparePassword(datos.contrasenia, usuario.contrasenia_hashed)

        if (!validPassword) {
            res.status(404).send('Usuario o contraseña incorrectos');
        } else {
            res.status(200).json(usuario);
        }
        
    } catch (error) {
        console.error('Error al logear usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
}

async function _findUserByEmail(correo){
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
}