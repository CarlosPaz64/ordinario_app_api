const express = require('express');
const app = express();
const routes = require('./routes/routes');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//Configura DotEnv
dotenv.config();

// Middleware para parsear JSON
app.use(express.json());
// Parsea las solicitudes con el tipo de contenido 'application/x-www-form-urlencoded'
app.use(bodyParser.urlencoded({ extended: true }));

// Parsea las solicitudes con el tipo de contenido 'application/json'
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow requests from http://localhost:3000
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  

// Rutas generales
app.use('/', routes);

// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}/`);
});