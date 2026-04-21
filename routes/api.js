const router = require('express').Router();
const mongoose = require('mongoose');

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CO-LAB Vault API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
      url: process.env.MONGO_CONNECTION_URL ? 'Set' : 'Not set'
    },
    appBaseUrl: process.env.APP_BASE_URL || 'Not set'
  });
});

router.get('/test-upload', (req, res) => {
  res.json({ 
    message: 'Upload endpoint is accessible',
    timestamp: new Date().toISOString()
  });
});

router.get('/test-db', async (req, res) => {
  try {
    // Test database connection
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Try to establish a new connection for testing
    const testConnection = mongoose.createConnection(process.env.MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    const testResult = await new Promise((resolve, reject) => {
      testConnection.once('connected', () => {
        testConnection.close();
        resolve('Connection successful');
      });
      
      testConnection.once('error', (err) => {
        testConnection.close();
        reject(err.message);
      });
      
      setTimeout(() => {
        testConnection.close();
        reject('Connection timeout');
      }, 10000);
    });
    
    res.json({
      dbState: states[dbState] || 'unknown',
      dbStateCode: dbState,
      mongoUrl: process.env.MONGO_CONNECTION_URL ? 'Set' : 'Not set',
      testConnection: testResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      dbState: mongoose.connection.readyState,
      testConnection: 'Failed'
    });
  }
});

module.exports = router;

