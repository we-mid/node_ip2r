let net = require("net");
let fs = require("fs");
const { query } = require("./query");

let sock = "/tmp/node_ip2r.unix.sock";

// 删除可能存在的旧 socket 文件
try {
  fs.unlinkSync(sock);
} catch (err) {
  if (!/no such file/.test(err)) {
    console.log("Failed to remove old socket file:", err);
  }
}

// type XReq struct {
//   UID string
//   IP  string
//   // 更多控制参数可拓展
// }
// type XRes struct {
//   UID    string
//   IP     string
//   Region string
//   Took   time.Duration
//   // todo more
// }
let server = net.createServer((socket) => {
  console.log("New client connected.");

  socket.on("data", (data) => {
    let startTime = Date.now();
    let str = data.toString();
    console.log("Received request:", str);

    let req = JSON.parse(str);
    let res = query(req.IP); // 这里歌query函数居然是sync的
    let region =
      [res.country, res.province, res.city, res.district]
        .filter(Boolean)
        .join("") +
      " " +
      res.isp;
    let ms = Date.now() - startTime;
    let ns = Math.floor(ms * 1000000); // nanoseconds to time.Duration in Go
    let resp = { UID: req.UID, IP: req.IP, Region: region, Took: ns };
    let respStr = JSON.stringify(resp);
    socket.write(respStr);
    // console.log("Sent response:", respStr);
  });

  socket.on("end", () => {
    console.log("Client disconnected.");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(sock, () => {
  console.log("Server listening on Unix Domain Socket at %s", sock);
});
