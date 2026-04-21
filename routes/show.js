const router = require('express').Router();
const mongoose = require('mongoose');
const File = require('../models/file');

router.get('/:uuid',async (req, res) => 
{
   try {
    // Create a new connection for this request
    const mongoURL = process.env.MONGO_CONNECTION_URL;
    if (!mongoURL) {
      return res.render('download', {error: "Database configuration error"});
    }

    const showConnection = mongoose.createConnection(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    // Create a new File model for this connection
    const ShowFile = showConnection.model('File', File.schema);

    const file = await ShowFile.findOne({uuid: req.params.uuid});
    
    // Close the connection
    await showConnection.close();
  
    if (!file) {
      return res.render('download', {error:"File not found"});
    }
    
    return res.render('download', {
      uuid:file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
    });

  } catch (error) {
    console.error('Show file error:', error);
    return res.render('download',{error: "something went wrong"});
  }
});

module.exports = router;