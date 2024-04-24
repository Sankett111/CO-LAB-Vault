const express = require('express');
const path = require('path');
const cors = require('cors');
PORT = 8000;

const app = express();

app.use(express.static('frontend'));
app.use('/css',express.static(__dirname + 'frontend/css/style.css'));
app.use('/js',express.static(__dirname + 'frontend/js/script.js'));
app.use('/images',express.static(__dirname + 'frontend/images/mars.png,space.png'));

app.get('',(req, res) => {
  res.sendFile(__dirname+'/frontend/js/index.html')
});


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










