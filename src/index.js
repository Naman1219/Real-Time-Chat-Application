const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

// server(emit)  --> client(receive)  countUpdated
// client(emit) --> server(receive)  increment

// socket.emit --> Send message to one client.
// socket.broadcast.emit -> sends message to everyone except one sending it.

// io.emit --> send messages to everyone.

io.on('connection', (socket) => {
  console.log('New web socket connection');

  socket.emit('message', 'Welcome!');
  socket.broadcast.emit('message', 'A new user has joined!');

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');
  });

  socket.on('sendLocation', (data) => {
    io.emit('message', `https://google.com/maps?q=${data.latitude},${data.longitude}`);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
