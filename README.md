# 📝 Task Manager Pro - App de Gestión de Tareas

Este es un proyecto completo de gestión de tareas desarrollado con **Node.js**, **Express**, **MongoDB**, **EJS** y **JWT**. Permite a los usuarios registrarse, iniciar sesión, crear, editar y eliminar tareas, todo desde una interfaz amigable con formularios modales y notificaciones visuales.

---

## 🚀 Características principales

- ✅ Registro e inicio de sesión con autenticación JWT
- 🔐 Rutas protegidas mediante middleware
- 🧠 Validación del lado del cliente y del servidor
- 📄 Vistas dinámicas con EJS
- 🧾 CRUD de tareas (Crear, Leer, Editar, Eliminar)
- 📦 MongoDB Atlas como base de datos
- 🌐 Estilo moderno con CSS personalizado
- 🔔 Notificaciones tipo Toast y formularios modales para UX mejorada

---

## 🛠️ Tecnologías usadas

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **EJS**
- **JWT (jsonwebtoken)**
- **express-session**
- **cookie-parser**
- **method-override**
- **dotenv**

---

## 📁 Estructura del proyecto

```
task-manager-pro/
│
├── app.js                     # Configuración de la aplicación Express
├── .env                       # Variables de entorno
│
├── controllers/
│   ├── authControllers.js     # Registro e inicio de sesión
│   └── tareaControllers.js    # Lógica CRUD de tareas
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── validarBodyUsuario.js
│   ├── validarCamposLogin.js
│   ├── validarBodyTarea.js
│   └── validarObjectId.js
│
├── models/
│   ├── Usuario.js
│   └── Tarea.js
│
├── routes/
│   ├── authRoutes.js
│   └── tareaRoutes.js
│
├── views/
│   ├── auth/
│   │   ├── login.ejs
│   │   └── registro.ejs
│   └── tareas/
│       └── listaTareas.ejs
│
├── public/
│   ├── styles/
│   │   └── estilos.css
│   └── js/
│       └── script.js
│
└── README.md
```

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/task-manager-pro.git
cd task-manager-pro
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/task-manager
JWT_SECRET=clave_super_segura
```

4. Ejecuta el servidor:

```bash
npm run dev
```

---

## 🔐 Autenticación

- Se utiliza **JWT** para mantener sesiones seguras del usuario.
- El token se almacena en cookies y se verifica en el middleware `authMiddleware`.
- Las rutas de tareas están protegidas, solo accesibles si el usuario ha iniciado sesión.

---

## 📬 Validaciones

- Middleware dedicado para validar:
  - Registro de usuario
  - Formulario de login
  - Campos del formulario de tareas
- Se devuelven errores como JSON en peticiones AJAX, o como mensajes visibles si aplica.

---

## 💡 Interfaz

- La interfaz se renderiza con **EJS**
- Los formularios (crear y editar) están integrados en **modales**
- Notificaciones de éxito o error se muestran con **toasts**
- Diseño adaptable y limpio con CSS básico

---

## 📄 Licencia

MIT License

Este proyecto es de código abierto y puede ser utilizado libremente con fines educativos o personales.

---

## 👨‍💻 Autor

**Juan Sebastián Serrano**  
📧 juseser@gmail.com

---
