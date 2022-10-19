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

      setInterval(() =>
        socket.emit(
          "techhello",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "techhello2",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "techhello3",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "techhello4",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

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
}

module.exports = { TechSocket };
