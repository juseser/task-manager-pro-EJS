const express = require('express');
const router = express.Router();

// Middlewares
const validarBodyTarea = require('../middlewares/validarBodyTarea');
const validarObjectId = require('../middlewares/validarObjectId');
const authMiddleware = require('../middlewares/authMiddleware'); //Token

// Controladores
const {obtenerTareas,crearTarea,obtenerTareaPorId,actualizarTarea,eliminarTarea} = require('../controllers/tareaControllers');

router.get('/tareas',authMiddleware,obtenerTareas);// Rutas públicas
router.post('/tareas',authMiddleware,validarBodyTarea,crearTarea);// Crear tarea
// Operaciones con ID
router.get('/tareas/:id',authMiddleware,obtenerTareaPorId);
router.put('/tareas/:id',authMiddleware,validarBodyTarea, actualizarTarea);//Editar Tarea
router.delete('/tareas/:id',authMiddleware,validarObjectId,eliminarTarea);

module.exports = router;
