const dotenv=require('dotenv')
dotenv.config(); //Charge les variables du fichier .env dans le process.env

module.exports={
    port : process.env.PORT,
    host: process.env.HOST,
    mysql: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections : true,
        connectionLimit: 10
    }

}