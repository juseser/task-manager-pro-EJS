const jwt = require('jsonwebtoken');//Importa la librería jsonwebtoken, que permite verificar y decodificar JWTs

// Define un middleware de autenticación para proteger rutas
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;//Obtiene el token desde las cookies del navegador

  if (!token) return res.redirect('/login'); //Si no hay token (usuario no autenticado), lo redirige al login
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);// Verifica el token usando la clave secreta (JWT_SECRET)
                                                              // Si el token es válido, decodifica su contenido (el payload)
    req.user = decoded;//Agrega los datos del usuario al objeto req para que estén disponibles en el resto de la app
    next();//Llama a next() para continuar con la ejecución del siguiente middleware o controlador
  } catch (err) {
    if (req.headers.accept.includes('application/json')) {//significa que el cliente espera una respuesta en formato JSON (como en una API).
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });//En ese caso, respondemos con un estado 401 (No autorizado)
                                                                            // y enviamos un objeto JSON con un mensaje de error.
    }
    req.session.mensaje = 'Token inválido o expirado';// Si la petición no esperaba JSON (por ejemplo, viene de un navegador normal),
                                                      // guardamos un mensaje de error en la sesión para mostrarlo en la vista.
    res.redirect('/login')// Redirigimos al usuario a la página de login.
  }
};

module.exports = authMiddleware;

