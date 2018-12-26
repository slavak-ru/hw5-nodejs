exports.start = server => {
  const io = require('socket.io').listen(server);
  const clients = {};

  io.on('connection', socket => {
    const currentClient = {
      id: socket.id,
      username: socket.handshake.headers['username'],
    };
    clients[socket.id] = currentClient;
    console.log(`Пользователь: ${clients[socket.id].username} вошел в чат`);

    socket.emit('all users', clients);
    io.sockets.emit('new user', currentClient);

    socket.on('chat message', (msg, user) => {
      socket.broadcast.to(user).emit('chat message', msg, currentClient.id);
    });

    socket.on('disconnect', data => {
      io.sockets.emit('delete user', currentClient.id);
      console.log(`Пользователь: ${clients[socket.id].username} покинул чат`);
      delete clients[socket.id];
    });
  });
};
