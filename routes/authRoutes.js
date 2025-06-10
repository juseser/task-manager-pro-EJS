const express=require('express');
const router=express.Router();
const {mostrarRegistro,registro,mostrarLogin,login}=require('../controllers/authControllers');
const validarBodyUsuario=require('../middlewares/validarBodyUsuario');
const validarCamposLogin=require('../middlewares/validarCamposLogin');

router.get('/registro',mostrarRegistro);
router.post('/registro',validarBodyUsuario,registro);
router.get('/login',mostrarLogin);
router.post('/login',validarCamposLogin,login);
module.exports = router;
