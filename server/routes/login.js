const express = require('express')
const app = express()

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

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


module.exports = app