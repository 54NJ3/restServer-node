require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
   
app.use( require('./routes/user') );


mongoose.connect(process.env.URLDB,  { useNewUrlParser: true, useCreateIndex: true }, (error, res) => {
    if (error) throw error;

    console.log('Data base online');
});
   
app.listen(process.env.PORT, () => console.log('Listening through port: ' , process.env.PORT))