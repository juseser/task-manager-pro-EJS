// Middleware para validar el cuerpo de la petición (req.body) al crear una tarea
const validarBodyTarea = (req, res, next) => {
  const { titulo } = req.body;// Extraemos el campo 'titulo' del cuerpo de la petición

  // Validamos que el título exista y tenga al menos 3 caracteres sin espacios vacíos
  if (!titulo || titulo.trim().length < 3) {
    const mensaje = 'El campo título es obligatorio y debe tener al menos 3 caracteres'; // Definimos el mensaje de error que se mostrará o enviará

    if (req.headers['content-type']?.includes('application/json')) {// Si el contenido de la petición es JSON (por ejemplo, enviado por fetch desde el frontend)
      return res.status(400).json({ mensaje }); // Respuesta adecuada para APIs o peticiones fetch
    }
    // Si no es JSON (ejemplo: formulario HTML tradicional), guardamos el mensaje en la sesión
    req.session.mensaje = mensaje;//Para mostrar el mensaje luego en la vista (usando HTML)
    return res.redirect('/tareas');// Redirigimos al usuario a la página de tareas
  }

  next();
};

module.exports = validarBodyTarea;

