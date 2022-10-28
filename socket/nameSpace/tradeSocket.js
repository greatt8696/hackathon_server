require("dotenv").config();

class TradeSocket {
  constructor(socket) {
    this.tradeSocket = socket.of("/trade");
    console.log("Socket/trade init");
    this.init();
  }

  init() {
    this.tradeSocket.on("connection", (socket) => {
      //trade socket when success connection
      socket.on("tradehelloclient", (arg) => {
        console.log("tradehelloclient 받음", arg);
      });
    });
  }
  emit = function (emitName, paylaod) {
    this.tradeSocket.emit(emitName, paylaod);
  };
}

module.exports = { TradeSocket };
