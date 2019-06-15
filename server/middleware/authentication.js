///========
//VERIFICAR TOKEN
///========

const jwt = require('jsonwebtoken')

let tokenVerify = (req, res, next)=>{
    //console.log(req);
    let token = req.get('token'); //Lectura del hearder en la peticion (postman)
    //console.log(token);
    
    jwt.verify(token,process.env.TOKEN_SEED, (error, decoded) =>{
        if(error){
            return res.status(401).json({
                ok: false,
                error
            })
        }
        ///decoded es el payload
        req.user = decoded.user;
        next()

    })
};

///========
//VERIFICAR ROL DE ADMINISTRADOR
///========
let adminVerify = (req, res, next)=>{
    let user = req.user;
    //console.log(req);
    if(user.role != 'ADMIN_ROLE'){

        return res.status(401).json({
            ok: false,
            error:{
                message: 'Unauthorized user'
            }
        });
    }
    //console.log(user);
    next()
};

module.exports={
    tokenVerify,
    adminVerify
}