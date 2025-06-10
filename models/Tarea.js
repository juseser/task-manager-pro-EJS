const mongoose = require('mongoose');// Requerimos Mongoose, que nos permite definir esquemas y modelos para MongoDB

// Definimos el esquema de la colección "tareas" (tasks)
// Aquí se describe la estructura que tendrá cada documento en la base de datos
const tareaSchema = new mongoose.Schema({

  // Campo: título de la tarea (obligatorio, al menos 3 caracteres)
  titulo: {
    type: String,           // Tipo de dato: cadena de texto
    required: true,         // Obligatorio
    minlength: 3            // Mínimo de 3 caracteres
  },

  // Campo: estado de la tarea
  // Solo se permite uno de los valores especificados en el array enum
  estatus: {
    type: String,
    enum: ['pendiente', 'en progreso', 'completada'], // valores válidos
    default: 'pendiente'                              // valor por defecto
  },

  // Campo: fecha límite para la tarea (opcional)
  fechaLimite: Date,

  // Campo: referencia al usuario que creó la tarea
  // Almacena el ID del usuario (ObjectId), que se refiere a un documento de la colección 'User'
  usuario: {
    type: mongoose.Schema.Types.ObjectId, // Tipo especial de Mongoose para referenciar otros documentos
    ref: 'User',                          // Nombre del modelo referenciado
    required: true                        // Este campo también es obligatorio
  }

}, {
  // Esta opción agrega automáticamente dos campos: createdAt y updatedAt
  timestamps: true
});

// Exportamos el modelo Tarea basado en el esquema tareaSchema
// Este modelo nos permite interactuar con la colección 'tareas' en MongoDB
module.exports = mongoose.model('Tarea', tareaSchema);//Tarea, seria el nombre de la coleccion que va a crear mongoose en mongo db, lo que hace es primero ponerlo todo en minuscula
                                                      //luego ponerlo en plural y luego crear la coleccion(tabla) en mongo db con ese nombre

