const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    filename: { type: String, required: true },
    originalFilename: { type: String, required: false },
    path: { type: String, required: false }, // For backward compatibility
    fileData: { type: Buffer, required: false }, // Store file data in database
    contentType: { type: String, required: false }, // Store MIME type
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    sender: { type: String, required: false },
    receiver: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);