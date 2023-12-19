const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

// server(emit)  --> client(receive)  countUpdated
// client(emit) --> server(receive)  increment

// socket.emit --> Sends an event to specific client.
// io.emit --> sends an event to every connected client
// io.to.emit --> emits an event to everybody in a specific chat room.
// socket.broadcast.emit -> sends event to every connected client, except one client sending it.
// socket.broadcast.to.emit --> same as above and specific to chat room

io.on('connection', (socket) => {
  console.log('New web socket connection');

  socket.on('join', ({ username, room }) => {
    socket.join(room);

    socket.emit('message', generateMessage('Welcome!'));
    socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`));
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter()
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.to('first').emit('message', generateMessage(message));
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left'));
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
    callback()
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
