const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { getTasksByUserId, getRecentTasks, getTasksByStatus } = require('../models/taskModel'); // Importa la función para obtener los usuarios


// Rutas para registrar usuarios
// Esta ruta renderiza el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Esta ruta maneja la solicitud POST para registrar un nuevo usuario
router.post('/register', userController.register);

//Rutas para logear usuarios
// Esta ruta renderiza el formulario de login
router.get('/login', (req, res) => {
    res.render('login'); // Asegúrate de tener una vista llamada 'login' en tu directorio de vistas
});

// Esta ruta maneja la solicitud POST para el inicio de sesión
router.post('/login', userController.loginUser);

// Ruta para desloguear usuarios
// Ruta para cerrar sesión
router.post('/logout', userController.logoutUser);

// Rutas del inicio de la aplicación
router.get('/content', async (req, res) => {
    const userId = req.session.userId;
    try {
        const tasks = await getTasksByUserId(userId);
        console.log("Tasks: ", tasks);
        res.render('content', { tasks });
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.render('content', { tasks: [], error: 'Error al obtener las tareas' });
    }
  });
  
  router.get('/', async (req, res) => {
    try {
        const user = await userModel.findUserById(req.userId); // Encuentra al usuario por su ID de usuario decodificado del token JWT
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
  
        // Obtén las tareas recientes y las tareas por estado
        const tasksByStatus = await getTasksByStatus(user.id);
        const recentTasks = await getRecentTasks(user.id);
  
        // Inicializa contadores
        let toDoCount = 0;
        let doingCount = 0;
        let doneCount = 0;
  
        // Cuenta las tareas por estado
        tasksByStatus.forEach(task => {
            if (task.estatus === 'To do') toDoCount = task.count;
            if (task.estatus === 'Doing') doingCount = task.count;
            if (task.estatus === 'Done') doneCount = task.count;
        });
  
        // Renderiza la vista con los datos obtenidos
        res.render('index', {
            user,
            toDoCount,
            doingCount,
            doneCount,
            recentTasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el dashboard');
    }
  });


  router.get('/:id', userController.encontrarUsuarioId);
module.exports = router;
