require("dotenv").config();

class TechSocket {
  constructor(socket) {
    this.techSocket = socket.of("/tech");
    console.log("Socket/tech init");
    this.init();
  }

  init() {
    this.techSocket.on("connection", (socket) => {
      //tech socket when success connection
      socket.on("techhelloclient", (arg) => {
        console.log("techhelloclient 받음", arg);
      });

      socket.on("joinRoom", ({ joinRoom }) => {
        socket.join(joinRoom);
        SocketServer.to(joinRoom).emit(
          "techhelloTestRoom",
          "techhelloTestRoom"
        );
        console.log(joinRoom);
      });
    });
  }

  emit = function (emitName, paylaod) {
    return this.techSocket.emit(emitName, paylaod);
  };
}

module.exports = { TechSocket };
