require("dotenv").config();

class GreenSocket {
  constructor(socket) {
    this.greenSocket = socket.of("/green");
    console.log("Socket/green init");
    this.init();
  }

  init() {
    this.greenSocket.on("connection", (socket) => {
      //green socket when success connection
      socket.on("greenhelloclient", (arg) => {
        console.log("greenhelloclient 받음", arg);
      });
      socket.on("joinRoom", ({ joinRoom }) => {
        socket.join(joinRoom);
        SocketServer.to(joinRoom).emit(
          "greenhelloTestRoom",
          "greenhelloTestRoom"
        );
        console.log(joinRoom);
      });
    });
  }
  emit = function (emitName, paylaod) {
    return this.greenSocket.emit(emitName, paylaod);
  };
}

module.exports = { GreenSocket };
