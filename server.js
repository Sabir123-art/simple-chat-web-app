const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const Message = require('./models/message');
const User = require('./models/user');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/chat_app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

require('./controllers/authController');
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

 socket.on('chat message', async (data) => {
  try {
    console.log('Received chat message:', data);
    
    const userId = data.userId;
    console.log('User ID:', userId);

    const currentUser = await User.findById(userId);
    console.log('Current User:', currentUser);

    if (currentUser) {
      const newMessage = new Message({ sender: userId, content: data.msg });
      await newMessage.save();

      currentUser.messages.push(newMessage);
      await currentUser.save();

      console.log('Message saved:', newMessage);
      io.emit('chat message', { username: currentUser.username, message: data.msg });
    } else {
    //   console.error(`User with ID ${userId} not found.`);
    }
  } catch (err) {
    console.error('Error handling chat message:', err);
  }
});
});





const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
