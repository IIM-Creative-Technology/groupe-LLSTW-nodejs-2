const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    content: { type: String, required: true, trim: true, unique: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;