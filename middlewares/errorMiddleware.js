// Este middleware captura cualquier error que haya sido pasado con next(err)
// y devuelve una respuesta uniforme al cliente
const errorMiddleware = (err, req, res, next) => {
    console.error('📛 Error detectado:', err.message);

    const statusCode = err.status || res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        error: err.message || 'Error interno del servidor'
    });
};

module.exports = errorMiddleware;
