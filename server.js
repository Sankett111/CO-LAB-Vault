const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static('frontend'));
app.use('/css', express.static(path.join(__dirname, 'frontend/css')));
app.use('/js', express.static(path.join(__dirname, 'frontend/js')));
app.use('/images', express.static(path.join(__dirname, 'frontend/images')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

const corsOptions = {
  origin: ['http://localhost:8000', 'http://localhost:5000', 'http://localhost:3000', 'https://*.vercel.app', 'https://*.now.sh', 'https://co-lab-vault-forked.vercel.app', 'https://co-lab-vault.vercel.app'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// Connect to database (optional for serverless)
// connectDB();

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'CO-LAB Vault API is working!' });
});

app.use('/api/files', require('./routes/files'));
app.use('/api', require('./routes/api'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
}

module.exports = app;










