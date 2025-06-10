const bcrypt = require('bcrypt'); //Importa el módulo `bcrypt`, que se usa para **hashear contraseñas** de forma segura
const jwt = require('jsonwebtoken');//Importa el módulo `jsonwebtoken` (JWT), que se usa para **generar y verificar tokens de autenticación
const Usuario = require('../models/Usuario');//Importa el modelo `Usuario`, que representa a los documentos de la colección `usuarios` en MongoDB.

// Mostrar formulario de login
const mostrarLogin = (req, res) => {
  const mensaje = req.session.mensaje;//Obtenemos el mensaje guardado en la sesión (por ejemplo, errores de login previos)
  delete req.session.mensaje;// Eliminamos el mensaje de la sesión para que no vuelva a mostrarse al recargar
  res.render('auth/login', { mensaje });//ruta de la vista que va a mostrar el login
};

// Procesar login
const login=async (req,res)=>{
  const {email,password}=req.body;// Extrae los campos del formulario enviados por POST

  try {
    const usuario = await Usuario.findOne({ email });// Busca un usuario en la BD con ese correo
    if (!usuario) {
      req.session.mensaje ='Correo no registrado';
      return res.redirect('/login');//Solo cambia la ruta (hace una nueva petición GET), la cual ejecuta el mostrar login
    }

    const valido = await bcrypt.compare(password, usuario.password);// Compara la contraseña ingresada con la guardada (encriptada)
    if (!valido) {
      req.session.mensaje ='Contraseña incorrecta';
      return res.redirect('/login');//Solo cambia la ruta (hace una nueva petición GET).
    }

    const token = jwt.sign({ id: usuario._id, nombre: usuario.nombre }, process.env.JWT_SECRET, { expiresIn: '1h' });// Genera token JWT con ID del usuario, nombre y duración de 1 hora

    res.cookie('token', token, { httpOnly: true });//Guarda el token en una cookie segura (no accesible desde JS del cliente)
    res.redirect('/tareas');//El navegador dice: "Ok, voy a /tareas"
                            // Express luego busca un router que maneje GET /tareas
  } catch (err) {
    req.session.mensaje = 'Error al iniciar sesión';
    res.redirect('/login');
                          //Si mandaras next(err), terminaría en una pantalla genérica de error 500 o JSON, que es más fea y no ayuda al usuario.
  }
};

// Mostrar formulario de registro
const mostrarRegistro = (req, res) => {
  const mensaje = req.session.mensaje;
  delete req.session.mensaje;
  res.render('auth/registro', {mensaje});//ruta de la vista que va a mostrar el formulario de registro
};

// Procesar registro
const registro = async (req, res) => {
  const { nombre, email, password } = req.body;//Extraemos los datos del formulario enviado por el usuario

  try {
    const existe = await Usuario.findOne({ email });//Busca si ya existe un usuario con ese email en la base de datos
    if (existe) {
      return res.render('auth/registro', { mensaje: 'El correo ya está registrado' });//Si ya existe, muestra la vista con un mensaje de advertencia
    }

    const hashed = await bcrypt.hash(password, 10);//Encripta la contraseña usando bcrypt con 10 rondas de sal

    const nuevoUsuario = new Usuario({ nombre, email, password: hashed });//Crea una nueva instancia del modelo Usuario con los datos
    await nuevoUsuario.save();//Guarda el nuevo usuario en la base de datos

    res.redirect('/login');//Redirige al formulario de login después del registro exitoso
  } catch (err) {
    res.render('auth/registro', { mensaje: 'Error al registrar el usuario' });//Renderiza la vista con un mensaje genérico de error
  }
};

module.exports = {mostrarLogin,login,mostrarRegistro,registro};
