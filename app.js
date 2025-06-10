//Cargar variables de entorno
require('dotenv').config();//Se usa para leer el archivo .env, añadirá cada variable al objeto process.env

//Importar módulos y paquetes
const express = require('express');//definir rutas, middlewares, manejar peticiones/respuestas, y crear fácilmente una app web
const mongoose = require('mongoose');//librería para conectar y trabajar con bases de datos MongoDB desde Node.js.
const path = require('path');//Importa el módulo nativo de Node.js llamado Path, que permite trabajar con rutas de archivos y directorios.
const cookieParser = require('cookie-parser');//Importa el middleware cookie-parser, que analiza cookies de las peticiones HTTP,permite 
                                              // leer cookies fácilmente desde req.cookies, útil para sesiones, tokens, etc

//Importar rutas y middlewares
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const tareasRoutes = require('./routes/tareaRoutes'); // Rutas de tareas
const errorMiddleware = require('./middlewares/errorMiddleware'); // Middleware de errores
const methodOverride = require('method-override'); // Para poder usar PUT y DELETE desde formularios
const session = require('express-session');//Importa el módulo express-session en tu archivo de Node.js. Este módulo es un middleware para 
                                          //Express que permite manejar sesiones de usuario en el servidor.

const app = express();//Inicializar aplicación

//Configuraciones de Express
app.set('view engine', 'ejs');//le dice a Express que use EJS (Embedded JavaScript) como motor de plantillas (views).
app.set('views', path.join(__dirname, 'views'));//configura la carpeta donde Express buscará las vistas, 
                                                // path.join(__dirname, 'views') crea la ruta absoluta correcta a la carpeta /views, sin errores por sistema operativo.

//Middlewares globales
app.use(express.json());//Hace que tu aplicación Express pueda entender y procesar datos JSON enviados en el cuerpo (body) de las peticiones HTTP, 
                        //especialmente en peticiones POST, PUT o PATCH.
app.use(express.static(path.join(__dirname, 'public')));//Sirve archivos estáticos desde la carpeta public (por ejemplo: CSS, imágenes, JS del navegador, etc.)
app.use(cookieParser());//Activa el middleware cookie-parser
app.use(express.urlencoded({ extended: true }));//Activa el middleware de Express para procesar formularios HTML que envían datos con application/x-www-form-urlencoded 
                                                // (el tipo por defecto en POST de formularios). extended: true permite usar objetos anidados si hicieras algo más complejo con formularios
app.use(methodOverride('_method'));//Permite que tu aplicación Express soporte métodos HTTP como PUT, PATCH o DELETE desde formularios HTML, que por defecto solo permiten GET y POST.
app.use(session({//configura y activa el middleware de sesiones en una aplicación Express usando express-session.
  secret: '01987Seb@s', 
  resave: false,
  saveUninitialized: true
}));                               

//Conectar a la base de datos MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión a MongoDB', err));

//Rutas públicas
app.get('/', (req, res) => res.redirect('/login'));//Cuando accedemos a la ruta http://localhost:3000/ nos redirige al login
app.use(authRoutes); // Maneja /registro y /login

//Rutas protegidas (requieren autenticación)
app.use(tareasRoutes); // Maneja /tareas

app.use(errorMiddleware);//Middleware de manejo de errores

//Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
});
