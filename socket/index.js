require("dotenv").config();
const { Server } = require("socket.io");
const SOCKET_PORT = process.env.SOCKET_PORT;
const SocketServer = new Server(SOCKET_PORT);

SocketServer.on("connection", (socket) => {
  socket.on("helloclient", (arg) => {
    console.log("helloclient 받음", arg);
  });
  setInterval(() =>
    socket.emit("hello", [100000000 * Math.random(), Date(Date.now())], 1)
  );

  setInterval(() =>
    socket.emit("hello2", [100000000 * Math.random(), Date(Date.now())], 1)
  );

  setInterval(() =>
    socket.emit("hello3", [100000000 * Math.random(), Date(Date.now())], 1)
  );

  setInterval(() =>
    socket.emit("hello4", [100000000 * Math.random(), Date(Date.now())], 1)
  );

  socket.on("joinRoom", ({ joinRoom }) => {
    socket.join(joinRoom);
    SocketServer.to(joinRoom).emit("helloTestRoom", "helloTestRoom");
    console.log(joinRoom);
  });
});

module.exports = { SocketServer };
