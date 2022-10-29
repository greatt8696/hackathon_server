require("dotenv").config();
const { Server } = require("socket.io");
const {
  UserSocket,
  TradeSocket,
  TechSocket,
  GreenSocket,
} = require("./nameSpace");

const SOCKET_PORT = process.env.SOCKET_PORT;
const socketServer = new Server(SOCKET_PORT, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3600",
      "http://localhost:3636",
      "http://192.168.0.106",
      "http://192.168.0.106:3600",
      "http://192.168.0.106:3636",
      "http://119.149.42.142:3600",
      "http://119.149.42.142:3636",
      "http://192.168.0.106:3000",
    ],
    credentials: true,
  },
});

socketServer.on("connection", (socket) => {
  //user socket when success connection
  socket.on("helloclient", (arg) => {
    console.log("helloclient 받음", arg);
  });

  socket.on("joinRoom", ({ joinRoom }) => {
    socket.join(joinRoom);
    socketServer.to(joinRoom).emit("helloTestRoom", "helloTestRoom");
    console.log(joinRoom);
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
