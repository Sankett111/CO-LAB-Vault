const express = require('express');
const path = require('path');
const cors = require('cors');
PORT = 3000;

const app = express();


const corsOptions = {
  origin: process.env.CLIENTS
}
app.use (cors(corsOptions));

app.use(express.json());

const connectDB = require('./config/db');
connectDB()

app.use(express.static('public'));
app.set('views ',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download',require('./routes/download'));


app.listen(PORT, console.log(`Listening on port ${PORT}.`));










