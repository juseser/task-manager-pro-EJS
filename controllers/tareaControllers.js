// Importamos el modelo TareaModel desde la carpeta models
// Este modelo nos permite interactuar con la colección "tareas" en MongoDB
const TareaModel = require('../models/Tarea');

// ====================================
// Controlador obtener todas las tareas
// ====================================
const obtenerTareas = async (req,res,next) => {
  try {
    const query={usuario: req.user.id}; //solo tareas del usuario autenticado
    const tareas = await TareaModel.find(query).sort({ fechaLimite: 1 })//Este método ordena los resultados por el campo fechaLimite. 1 ascendente, -1 descendente
   
    if (req.headers.accept.includes('application/json')) return res.json(tareas);//Si es una petición AJAX (fetch), devolvemos JSON
    res.render('tareas/listaTareas', { mensaje: null, tareas, usuario: req.user });//Si no, hacemos un render de la pagina
  } catch (err) {
    next(err);//next(err) no renderiza ni imprime nada directamente.
              //Solo pasa el error al siguiente middleware.
              //Lo que sí muestra algo al usuario es el middleware final (como res.render() o res.json() dentro del archivo errorMiddleware.js).
  }
};

// ==============================
// Controlador crear tarea
// ==============================
const crearTarea = async (req, res, next) => {
  try {
    //Creamos una nueva instancia del modelo Tarea con los datos recibidos en el body del request
    const tarea = new TareaModel({
      ...req.body,//con este spreed operator concatenamos las propiedades que vienen en el request con este nuevo objeto
      usuario: req.user.id
    });// req.body debe contener un objeto con los campos definidos en el esquema (por ejemplo: { title: "Leer", status: "pendiente" }) gracias al middleware express.urlencoded({ extended: true })

    // Guardamos la nueva tarea en la base de datos con .save()
    await tarea.save();// Esto ejecuta las validaciones del esquema antes de insertar el documento

    // Verificamos si la cabecera 'Content-Type' de la petición es exactamente 'application/json'
  // Esto indica que los datos se enviaron como JSON, por ejemplo desde un fetch() o una API externa
    if (req.headers['content-type'] === 'application/json') {
      // Si es así, respondemos con estado 201 (Created) y un mensaje en formato JSON
      // Esto es ideal para clientes que esperan una respuesta tipo API
      return res.status(201).json({ mensaje: 'Tarea creada correctamente' });
    }

    // Si fue por formulario tradicional, redirigir
    res.redirect('/tareas?creada=true');// Redirige al usuario a /tareas con un query ?creada=true,
                                       // lo que fuerza una nueva petición GET para recargar la lista de tareas,
                                       // y permite que el frontend muestre un toast de "tarea creada correctamente".
  } catch (error) {
    // Si es una petición fetch (espera JSON), responder JSON
    if (req.headers['content-type'] === 'application/json') {
      return res.status(500).json({ mensaje: '❌ Error inesperado en el servidor' });
    }
    // Si es un form tradicional, pasar al middleware de errores
    next(error);
  }
};

// ==============================
// Controlador obtener tarea por id
// ==============================
const obtenerTareaPorId = async (req,res,next) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Usuario no autenticado' });
    const tarea = await TareaModel.findById(req.params.id);
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    if (tarea.usuario.toString() !== req.user.id) return res.status(403).json({ error: 'No tienes permiso para acceder a esta tarea' });
    
    res.json(tarea); //Devuelve JSON para el fetch, se usa para cargar los datos en el form editar
  } catch (err) {
    next(err);
  }
};

// ==============================
// Controlador actualizar tarea
// ==============================
const actualizarTarea = async (req, res, next) => {
  try {
    // Busca y actualiza la tarea que pertenece al usuario autenticado
    const tarea = await TareaModel.findOneAndUpdate(
      { _id: req.params.id, usuario: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });// Si no se encontró ninguna tarea que coincida (ya no existe o no pertenece al usuario), se devuelve error 404
    }
    // Si la petición vino desde un cliente que ENVÍA datos en JSON (por ejemplo, desde un fetch),
    // se detecta por el header 'Content-Type'
    if (req.headers['content-type'] === 'application/json') {
      return res.status(200).json({ mensaje: 'Tarea actualizada correctamente' });// En ese caso, se responde en formato JSON (ideal para APIs o peticiones fetch)
    }
    // Si no es una petición con JSON (es decir, viene desde un formulario HTML tradicional),
    // se hace una redirección y se pasa un parámetro en la URL para mostrar un mensaje tipo "toast"
    res.redirect('/tareas?editada=true');
  } catch (error) {
    // Si ocurre un error y la petición fue hecha con JSON (fetch), respondemos con error en JSON
    if (req.headers['content-type'] === 'application/json') {
      return res.status(500).json({ mensaje: '❌ Error inesperado al editar' });
    }
    // En otros casos (por ejemplo, formularios), delegamos el error al middleware de manejo de errores
    next(error);
  }
};

// ==============================
// Controlador eliminar tarea
// ==============================
const eliminarTarea = async (req, res, next) => {
  try {
     // Verifica si el usuario está autenticado (debe existir req.user y su id)
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Usuario no autenticado' });
    
    // Busca la tarea por ID en la base de datos
    const tarea = await TareaModel.findById(req.params.id);

   // Si no se encontró la tarea con ese ID, retorna error 404
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });

    // Verifica si la tarea pertenece al usuario autenticado
    if (tarea.usuario.toString() !== req.user.id) return res.status(403).json({ error: 'No tienes permiso para eliminar esta tarea' });

    // Intenta eliminar la tarea, asegurándose de que también pertenezca al usuario (doble verificación de seguridad)
    const resultado = await TareaModel.deleteOne({
      _id: req.params.id,
      usuario: req.user.id
    });

    // Si no se eliminó ninguna tarea (deletedCount === 0), responde que no se encontró
    if (resultado.deletedCount === 0) return res.status(404).json({ error: 'Tarea no encontrada' });

    // Si todo salió bien, responde con mensaje de éxito
    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (err) {
    // Pasa el error al middleware de manejo de errores
    next(err);
  }
};

// Exportamos los controladores para usarlos en el archivo de rutas
module.exports = {obtenerTareas,crearTarea,obtenerTareaPorId,actualizarTarea,eliminarTarea};

