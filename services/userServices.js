const userModel = require('../models/userModel');

async function registerUser (nombre, apellidos, correo, contraseniaHasheada) {
    return await userModel.registerUser(nombre, apellidos, correo, contraseniaHasheada);
}

async function findUserByEmail(correo) {
    return await userModel.findUserByEmail(correo);
}

async function findUserById(userId) {
    return await userModel.findUserById(userId);
}

module.exports = {
    registerUser,
    findUserByEmail,
    findUserById
};