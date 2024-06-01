const taskService = require('../services/taskServices');

async function createTask(req, res) {
    const { descripcion, estatus, fecha_finalizacion, importancia, id_usuario } = req.body;
    try {
        const taskId = await taskService.createTask(descripcion, estatus, fecha_finalizacion, importancia, id_usuario);
        res.status(201).json({ message: 'Tarea creada', taskId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
}

async function getTasksByUserId(req, res) {
    const { id_usuario } = req.params;
    try {
        const tasks = await taskService.getTasksByUserId(id_usuario);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas del usuario' });
    }
}

async function updateIdTask(req, res) {
    const { id } = req.params;
    const { descripcion, estatus, fecha_finalizacion, importancia } = req.body;

    try {
        const result = await taskService.updateIdTask(id, descripcion, estatus, fecha_finalizacion, importancia);
        if (result) {
            res.json({ message: 'Tarea actualizada' });
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
}

async function getTaskById(req, res) {
    const { id } = req.params;
    try {
        const task = await taskService.getTaskById(id);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
}

async function toggleTaskStatus(req, res) {
    const { id } = req.params;
    try {
        const newStatus = await taskService.toggleTaskStatus(id);
        res.json({ message: 'Estado de la tarea actualizado', newStatus });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado de la tarea' });
    }
}

async function deleteTask(req, res) {
    const { id } = req.params;
    try {
        const result = await taskService.deleteTask(id);
        if (result) {
            res.json({ message: 'Tarea eliminada' });
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
}

async function getTasksByStatus(req, res) {
    const { id_usuario } = req.params; // Obtener el id_usuario de los parámetros de la ruta
    try {
        const tasks = await taskService.getTasksByStatus(id_usuario);
        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas por estatus:', error);
        res.status(500).json({ error: 'Error al obtener tareas por estatus' });
    }
}


async function getRecentTasks(req, res) {
    const { id_usuario } = req.params;
    const { limit } = req.query;
    try {
        const tasks = await taskService.getRecentTasks(id_usuario, limit ? parseInt(limit, 10) : undefined);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas recientes' });
    }
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
