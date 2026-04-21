const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');

// For Vercel deployment, we'll use memory storage and store file data in database
let storage = multer.memoryStorage();

let upload = multer({ 
  storage, 
  limits:{ fileSize: 1000000 * 10 }, // 10MB limit for testing
}).single('myfile'); 

router.post('/', (req, res) => {
    console.log('File upload request received');
    upload(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(500).send({ error: err.message });
      }
      
      if (!req.file) {
        console.error('No file in request');
        return res.status(400).send({ error: 'No file uploaded' });
      }
      
      console.log('File received:', {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
      
      try {
        // Create a new connection for this upload
        const mongoURL = process.env.MONGO_CONNECTION_URL;
        if (!mongoURL) {
          throw new Error('MongoDB connection URL not found');
        }

        console.log('Creating new database connection for upload...');
        const uploadConnection = mongoose.createConnection(mongoURL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 15000,
        });

        // Create a new File model for this connection
        const UploadFile = uploadConnection.model('File', File.schema);

        const file = new UploadFile({
            filename: req.file.originalname || req.file.filename,
            originalFilename: req.file.originalname,
            fileData: req.file.buffer, // Store file data in database
            contentType: req.file.mimetype,
            uuid: uuidv4(),
            size: req.file.size
        });
        
        const response = await file.save();
        
        // Close the connection
        await uploadConnection.close();
        
        // Use a fallback URL if APP_BASE_URL is not set
        const baseUrl = process.env.APP_BASE_URL || `https://${req.get('host')}`;
        res.json({ file: `${baseUrl}/files/${response.uuid}` });
      } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).send({ 
          error: 'Error saving file to database',
          details: error.message
        });
      }
    });
});

router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;
  if(!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ error: 'All fields are required except expiry.'});
  }
  
  try {
    const file = await File.findOne({ uuid: uuid });
    if(file.sender) {
      return res.status(422).send({ error: 'Email already sent once.'});
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
  
    const sendMail = require('../services/email');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'CO-LAB file sharing',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/mailTemp')({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
    }).then(() => {
      return res.json({success: true});
    }).catch(err => {
      return res.status(500).json({error: 'Error in email sending.'});
    });
} catch(err) {
  return res.status(500).send({ error: 'Something went wrong.'});
}

});

module.exports = router;