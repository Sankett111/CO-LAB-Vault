const router = require('express').Router();
const mongoose = require('mongoose');
const File = require('../models/file');

router.get('/:uuid', async(req, res) =>{
     try {
        // Create a new connection for this download
        const mongoURL = process.env.MONGO_CONNECTION_URL;
        if (!mongoURL) {
          return res.status(500).send('Database configuration error');
        }

        const downloadConnection = mongoose.createConnection(mongoURL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 10000,
        });

        // Create a new File model for this connection
        const DownloadFile = downloadConnection.model('File', File.schema);

        const file = await DownloadFile.findOne({uuid: req.params.uuid});
        
        // Close the connection
        await downloadConnection.close();
        
        if(!file){
           return res.render('download', {error:'Link has been Expired'});
        }

        // For Vercel deployment, serve file from database
        if (file.fileData) {
           res.set({
               'Content-Type': file.contentType || 'application/octet-stream',
               'Content-Disposition': `attachment; filename="${file.originalFilename || file.filename}"`,
               'Content-Length': file.size
           });
           res.send(file.fileData);
        } else if (file.path) {
           // Fallback for existing files with path
           const filePath = `${__dirname}/../${file.path}`;
           res.download(filePath);
        } else {
           res.status(404).send('File not found');
        }
     } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Error retrieving file');
     }
});
module.exports = router;