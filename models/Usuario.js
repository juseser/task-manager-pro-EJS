const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 6 }
},{
  timestamps: true // 👈 Esto agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Usuario', usuarioSchema);
