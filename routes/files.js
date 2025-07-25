const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/') ,
     filename: function (req, file, cb) {
    let finalName;
    const ext = path.extname(file.originalname);

    if (req.body && req.body.filename && req.body.filename.trim() !== '') {
      const safeName = req.body.filename.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
      finalName = safeName + ext;
    } else {
      finalName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    }
    
    req.fileOriginalName = file.originalname;
    req.fileStoredName = finalName;

    cb(null, finalName);
  }
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile'); 

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
        const file = new File({
            filename: req.file.originalname || req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
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
  
    const sendMail = require('../services/mailService');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'CO-LAB file sharing',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailTemplate')({
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