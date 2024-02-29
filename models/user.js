const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:String,
  password:String,
 sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message'
    },
  content: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
