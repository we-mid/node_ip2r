const net = require("net");

function sendRequest(requestData) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection("/tmp/unix.socket", () => {
      console.log("Connected to the Unix Domain Socket server.");

      // 发送请求
      client.write(JSON.stringify(requestData));

      // 监听数据事件
      client.on("data", (data) => {
        const response = JSON.parse(data.toString());
        // console.log("Received response:", response);
        resolve(response);
      });

      // 监听结束事件
      client.on("end", () => {
        console.log("Connection closed.");
      });

      // 监听错误事件
      client.on("error", (err) => {
        console.error("Socket error:", err);
        reject(err);
      });
    });
  });
}

async function startClient() {
  try {
    const requestData = { type: "request", value: "Hello from Node.js!" };
    const response = await sendRequest(requestData);
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

startClient();
