const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const {v4:uuidv4}=require('uuid');


let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/') ,
  filename: (req, file, cb) => {
      const uniqueName = `${(file.originalname)}`;
            cb(null, uniqueName)
  } ,
});

let upload=multer({
    storage,
    limit:{fileSize:1000000 * 100}, 
  }).single('myfile');

  router.post('/', (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      
        const file = new File({

         filename: req.file.fieldname,
         uuid: uuidv4(),
         path: req.file.path,
         size: req.file.size,

        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
      });
});
router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom, size, expires, download } = req.body;

  // Validate request
  if (!uuid || !emailFrom || !emailTo) {
    res.status(422).send({ error: "All field are required!" });
  }

  //   Get
  const file = await File.findOne({ uuid: uuid });

  if (!file) {
    return res.render("download", { error: "Link has been expired" });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  // Send email
  const sendMail = require("../services/email");
  sendMail({
    from: emailFrom,
    to: emailTo,
     subject: `CO-LAB Vault | ${emailFrom} shared a file with you`,
    text: `${emailFrom} shared a file with you`,
    html: require('../services/mailTemp')({
      emailFrom,
      download: `${process.env.APP_BASE_URL}/files/${uuid}?source=email`,
      size: parseInt(file.size/1000)+'KB',
      expires: '12 hrs',
        })
     
  });

  res.send({ success: true, message: "Mail sent successfully" });
});

module.exports = router;