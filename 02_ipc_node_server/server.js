const net = require("net");
const fs = require("fs");

// 删除可能存在的旧 socket 文件
try {
  fs.unlinkSync("/tmp/unix.socket");
} catch (err) {
  if (!/no such file/.test(err)) {
    console.log("Failed to remove old socket file:", err);
  }
}

const server = net.createServer((socket) => {
  console.log("New client connected.");

  socket.on("data", (data) => {
    const request = JSON.parse(data.toString());
    console.log("Received request:", request);

    const response = {
      type: "response",
      value: `Response to your '${request.value}' request`,
    };

    socket.write(JSON.stringify(response));
  });

  socket.on("end", () => {
    console.log("Client disconnected.");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen("/tmp/unix.socket", () => {
  console.log("Server listening on Unix Domain Socket at /tmp/unix.socket");
});
