require("dotenv").config();

class TreeSocket {
  constructor(socket) {
    this.treeSocket = socket.of("/tree");
    console.log("Socket/tree init");
    this.init();
  }

  init() {
    this.treeSocket.on("connection", (socket) => {
      //tree socket when success connection
      socket.on("treehelloclient", (arg) => {
        console.log("treehelloclient 받음", arg);
      });

      setInterval(() =>
        socket.emit(
          "treehello",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "treehello2",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "treehello3",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "treehello4",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      socket.on("joinRoom", ({ joinRoom }) => {
        socket.join(joinRoom);
        SocketServer.to(joinRoom).emit(
          "treehelloTestRoom",
          "treehelloTestRoom"
        );
        console.log(joinRoom);
      });
    });
  }
}

module.exports = { TreeSocket };
