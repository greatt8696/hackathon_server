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

      setInterval(() =>
        socket.emit(
          "greenhello",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "greenhello2",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "greenhello3",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "greenhello4",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

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
}

module.exports = { GreenSocket };
