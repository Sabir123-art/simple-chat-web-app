const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    },
  content: String
}, { timestamps: true });

const message = mongoose.model('Message', messageSchema);

module.exports = message;
