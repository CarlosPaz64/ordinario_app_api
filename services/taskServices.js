const taskModel = require('../models/taskModel');

async function createTask(descripcion, estatus, fecha_finalizacion, importancia, id_usuario) {
    return await taskModel.createTask(descripcion, estatus, fecha_finalizacion, importancia, id_usuario);
}

async function getTasksByUserId(id_usuario) {
    return await taskModel.getTasksByUserId(id_usuario);
}

async function updateIdTask(id, descripcion, estatus, fecha_finalizacion, importancia) {
    return await taskModel.updateIdTask(id, descripcion, estatus, fecha_finalizacion, importancia);
}

async function getTaskById(id) {
    return await taskModel.getTaskById(id);
}

async function toggleTaskStatus(id) {
    return await taskModel.toggleTaskStatus(id);
}

async function deleteTask(id) {
    return await taskModel.deleteTask(id);
}

async function getTasksByStatus(id_usuario) {
    return await taskModel.getTasksByStatus(id_usuario);
}

async function getRecentTasks(id_usuario, limit = 5) {
    return await taskModel.getRecentTasks(id_usuario, limit);
}

module.exports = {
    createTask,
    getTasksByUserId,
    updateIdTask,
    getTaskById,
    toggleTaskStatus,
    deleteTask,
    getTasksByStatus,
    getRecentTasks
};
