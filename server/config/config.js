/*
    PUERTO : si no existe (ambiente de produccion u online), 
    entonces trabajamos sobre el purto 3000 (ambiente de desarrollo o localhost)
*/
process.env.PORT = process.env.PORT || 3000;

/*
ENTORNO
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


/*
BASE DE DATOS
*/

let urlDB;
if(process.env.NODE_ENV === 'dev')
{
    urlDB = 'mongodb://localhost:27017/coffee';
}else{
    urlDB = process.env.MONGO_URL
}


process.env.URLDB = urlDB;