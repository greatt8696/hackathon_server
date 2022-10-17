require("dotenv").config();

class TradeSocket {
  constructor(socket) {
    this.tradeSocket = socket.of("/trade");
    console.log("Socket : /trade init");
    this.init();
  }

  init() {
    this.tradeSocket.on("connection", (socket) => {
      //trade socket when success connection
      socket.on("tradehelloclient", (arg) => {
        console.log("tradehelloclient 받음", arg);
      });

      setInterval(() =>
        socket.emit(
          "tradehello",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "tradehello2",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "tradehello3",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );

      setInterval(() =>
        socket.emit(
          "tradehello4",
          [100000000 * Math.random(), Date(Date.now())],
          1
        )
      );
    });
  }
}

module.exports = { TradeSocket };
