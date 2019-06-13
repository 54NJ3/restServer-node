const express = require('express')
const app = express()
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const _ = require('underscore')

app.get('/user', function (req, res) {
    //res.json('get LOCAL User')
    let from = req.query.from || 0;
    from = Number(from)

    let limit =  req.query.limit || 5;
    limit = Number(limit)

    //Solo usuarios activos
    User.find({state: true}, 'name email role state google img') // omitimos el password para no exponerlo en las consultas
        .skip(from)
        .limit(limit)
        .exec((error,usersArray) => {
            if(error)
            {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            
            User.countDocuments({state: true}, (error,counter) =>{

                res.json({
                    ok: true,
                    usersArray,
                    counter
                })

            })


        })
})
  
app.post('/user', function (req, res) {
  
      ///res.json('set User')
    let body = req.body
    //console.log(body);
    
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
    });


    user.save( (error, userDB) => {
        //console.log(user);
            if(error)
            {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            //userDB.password = null;
            
            res.json({
                ok: true,
                user: userDB
            })

    });

  
})
     
app.put('/user/:id', function (req, res) {
   
    let body = _.pick(req.body, ['name','email', 'img', 'role' , 'state'])

    let id = req.params.id;

   
    User.findByIdAndUpdate(id, body, {new: true, runValidators: true} ,(error, userDB) => {
        if(error){
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.json({
            ok: true,
            user: userDB
        })
    })

    //res.json('update User')
})
  
app.delete('/user/:id', function (req, res) {
    ///res.json('delete User')
    let body = _.pick(req.body, ['state'])
    body.state = false
    let id = req.params.id;

    //Eliminacion logica
    User.findByIdAndUpdate(id, body, {new: true} ,(error, userDB) => {
        if(error){
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.json({
            ok: true,
            user: userDB
        })
    })

    /*
    //Eliminacion Fisica
    User.findByIdAndRemove(id, (error, userRemoved) =>{
        if(error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        if(!userRemoved){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User could not be found...'
                }
            })

        }
        res.json({
            ok: true,
            user: userRemoved
        })
    })
    */

})


module.exports = app