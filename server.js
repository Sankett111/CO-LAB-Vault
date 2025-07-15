const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const PORT = 5000;

const app = express();

app.use(express.static('frontend'));
app.use('/css', express.static(path.join(__dirname, 'frontend/css')));
app.use('/js', express.static(path.join(__dirname, 'frontend/js')));
app.use('/images', express.static(path.join(__dirname, 'frontend/images')));

app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/js/index.html'));
});

const corsOptions = {
  origin: ['http://localhost:8000', 'http://localhost:5000' ,'http://localhost:3000']
};
app.use(cors(corsOptions));

app.use(express.json());

connectDB();

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));










