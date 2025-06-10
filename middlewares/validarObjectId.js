const mongoose = require('mongoose');

const validarObjectId = (req, res, next) => {
  const { id } = req.params;

  // Verifica que sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: 'El ID proporcionado no es válido' });
  }

  next();
};

module.exports = validarObjectId;