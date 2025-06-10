const validarCamposLogin=(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || email.trim().length<1){
        req.session.mensaje = 'El campo email es obligatorio';
        return res.redirect('/login');
    }
    if(!password || password.trim().length<1){
        req.session.mensaje = 'El campo password es obligatorio';
        return res.redirect('/login');;
    }
    next();
}

module.exports=validarCamposLogin;