require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//configuracion global de rutas
app.use( require('./routes/index') );

//habilitar la carpeta public (FRONT END)
app.use(express.static(path.resolve(__dirname, '../public')))


mongoose.connect(process.env.URLDB,  { useNewUrlParser: true, useCreateIndex: true }, (error, res) => {
    if (error) throw error;

    console.log('Data base online');
});
   
app.listen(process.env.PORT, () => console.log('Listening through port: ' , process.env.PORT))