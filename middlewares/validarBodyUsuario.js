const validarBodyUsuario=(req,res,next)=>{
    const {nombre,email,password}=req.body;
    if(!nombre || nombre.trim().length<3){
        req.session.mensaje = 'El campo nombre es obligatorio';
        return res.redirect('/registro');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !emailRegex.test(email)){
        req.session.mensaje = 'Email inválido o faltante';
        return res.redirect('/registro');
    }

    if(!password || password.trim().length<6){
        req.session.mensaje = 'El campo password es obligatorio';
        return res.redirect('/registro');
    }

    next();
}

module.exports=validarBodyUsuario;