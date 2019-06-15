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
Vencimiento del token: 30 dias
*/

process.env.TOKEN_EXPIRATION = "30d"

/*
SEED de autenticación
*/
process.env.TOKEN_SEED =  process.env.TOKEN_SEED || 'este-es-el-seed-desarrollo'
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


/*
GOOGLE CLIENT ID
*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '1051325883584-ba2e7e48volqda9ci181dl0q8jreo302.apps.googleusercontent.com';