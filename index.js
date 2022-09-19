const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const PORT = process.env.PORT || 5050;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/:id', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/*
 * On Connection
 */
io.on('connection', (socket) => {
  // log user connected
  console.log('a user connected');

  socket.on('joinroom', function (data) {
    const { roomId } = data;
    socket.join(roomId);

    socket.on('newMessage', function (data) {
      const { message } = data;
      io.to(roomId).emit("newMessage", message);
    });
  });

  // on disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`listening http://localhost:${PORT}`);
});
