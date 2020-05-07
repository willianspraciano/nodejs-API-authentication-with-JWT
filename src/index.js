const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Importing Routes
const authRoute = require('./routes/auth');

const app = express();

dotenv.config();

//Connect to mongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, 
  ()=>{console.log('Conectado ao mongoDB')}
);

//Middware
app.use(express.json());
//Route Middlewares
app.use('/api/user', authRoute);


app.listen(3333);