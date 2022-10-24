require("dotenv").config();
const { Server } = require("socket.io");
const {
  UserSocket,
  TradeSocket,
  TechSocket,
  GreenSocket,
} = require("./nameSpace");

const SOCKET_PORT = process.env.SOCKET_PORT;
const socketServer = new Server(SOCKET_PORT);

socketServer.on("connection", (socket) => {
  //user socket when success connection
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
    socketServer.to(joinRoom).emit("helloTestRoom", "helloTestRoom");
    console.log(joinRoom)
    
    
    ;
  });
});

const userSocket = new UserSocket(socketServer);
const tradeSocket = new TradeSocket(socketServer);
const techSocket = new TechSocket(socketServer);
const greenSocket = new GreenSocket(socketServer);

module.exports = {
  socketServer,
  userSocket,
  tradeSocket,
  techSocket,
  greenSocket,
};
