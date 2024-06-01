const express = require('express');
const router = express.Router();
const { getTaskById, updateIdTask, deleteTask, toggleTaskStatus, getTasksByStatus, getRecentTasks, getTasksByUserId} = require('../controllers/taskController');
const { createTask } = require('../models/taskModel');


router.get('/:id', getTaskById);  // Ruta para obtener una tarea específica
router.post('/update-task/:id', updateIdTask);  // Ruta para actualizar una tarea
router.delete('/:id', deleteTask);  // Ruta para eliminar una tarea
router.post('/:id/toggle-status', toggleTaskStatus); // Ruta para marcar como hecha una tarea
router.get('/status/:id_usuario', getTasksByStatus); // Ruta para llamar a las tareas por su  estatus
router.get('/recent/:id_usuario', getRecentTasks); // Ruta para llamar a las tareas recientes
router.get('/user/:id_usuario', getTasksByUserId); // Ruta para llamar a las tareas por el id del usuario



// Función para obtener la fecha de hoy en la zona horaria local en formato yyyy-mm-dd
function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Ruta para crear una nueva tarea
router.post('/create-task', async (req, res) => {
    const { descripcion, fecha_finalizacion, importancia, id_usuario } = req.body;

    // Obtener la fecha de hoy en formato yyyy-mm-dd
    const today = getLocalDate();
    console.log('Fecha de hoy:', today);
    console.log('Fecha de finalización:', fecha_finalizacion);

    // Verificar si la fecha de finalización es igual a la fecha de hoy
    const estatus = fecha_finalizacion === today ? 'Doing' : 'To do';
    console.log('Estatus determinado:', estatus);

    try {
        const taskId = await createTask(descripcion, estatus, fecha_finalizacion, importancia, id_usuario);
        res.status(201).json({ id: taskId }); // Retorna el ID de la nueva tarea creada
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ error: 'Error al crear la tarea. Inténtalo de nuevo.' });
    }
});



module.exports = router;
