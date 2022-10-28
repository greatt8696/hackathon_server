require("dotenv").config();

class UserSocket {
  constructor(socket) {
    this.userSocket = socket.of("/user");
    console.log("Socket/user init");
    this.init();
  }

  init() {
    this.userSocket.on("connection", (socket) => {
      //user socket when success connection
      socket.on("userhelloclient", (arg) => {
        console.log("userhelloclient 받음", arg);
      });

      socket.on("joinRoom", ({ joinRoom }) => {
        socket.join(joinRoom);
        SocketServer.to(joinRoom).emit(
          "userhelloTestRoom",
          "userhelloTestRoom"
        );
        console.log(joinRoom);
      });
    });
  }
  emit = function (emitName, paylaod) {
    this.userSocket.emit(emitName, paylaod);
  };
}

module.exports = { UserSocket };
