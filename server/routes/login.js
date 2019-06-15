const express = require('express')
const app = express()

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/user')

app.post('/login', (req, res) => {

    let body = req.body;
    
    User.findOne({email: body.email}, (error,userDB)=>{
        if(error){
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if(!userDB){ //Fallo la validacion del email, los parentesis dentro del mensaje deben ser quitados en etapa d e produccion ya que correria riesgo la cuenta del cliente
            return res.status(400).json({
                ok: false,
                error: {
                    message: '(User) or password are incorrect...'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, userDB.password)){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User or (password) are incorrect...'
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        },  process.env.TOKEN_SEED, {expiresIn: process.env.TOKEN_EXPIRATION});

        res.json({
            ok: true,
            user: userDB,
            token 
        })

    })

})

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();//-----> informacion del usuario

    /*console.log('NAME : ' + payload.name);
    console.log('EMAIL: ' + payload.email);
    console.log('PIC  : ' + payload.picture);*/


    return { 
        name: payload.name,  
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async (req, res) => {
    //let token = req.body;

    /*res.json({
        body: req.body
    })*/

    let token = req.body.idtoken;
    let googleUser;
    try {
        googleUser = await verify(token)
    }catch(error){
      return res.status(403).json({
          ok: false, 
          error: {
              message: 'Invalid Token'
          }
      })
    }
 
    User.findOne({email: googleUser.email} , (error, userDB) => {
        if(error){
            return res.status(500).json({
                ok: false, 
                error
            }); 
        }

        if(userDB) {
            if(!userDB.google) { /// El usuario se registro de manera normal anteriormente
                return res.status(400).json({
                    ok: false,
                    error: {
                        message:  'You are already registered. Cannot login with Google service, you must use a normal user authentication...'
                    }
                });
            }else{
                let token = jwt.sign({
                    user: userDB
                },  process.env.TOKEN_SEED, {expiresIn: process.env.TOKEN_EXPIRATION});

                return res.json({
                    ok: true,
                    user: userDB,
                    token 
                })
            }

        }else{ //primera vez. El usuario no existe en la base de datos
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email; 
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)'; //La contraseña es requerida, sin embargo el login de google no lo requiere. Lo ideal seria que el usuario ponga la contraseña.
            //Esta contraseña es encriptada por un hash de 10 vueltas segun nuestra configuracion.
            
            
            user.save((error, userDB) => {
                if(error){
                    return res.status(500).json({
                        ok: false,
                        error
                    });    
                }
                let token = jwt.sign({
                    user: userDB
                },  process.env.TOKEN_SEED, {expiresIn: process.env.TOKEN_EXPIRATION});


                return res.json({
                    ok: true,
                    user: userDB, 
                    token
                })

                
            })
        }


    })

    /*res.json({
        user: googleUser 
    })*/

})

module.exports = app