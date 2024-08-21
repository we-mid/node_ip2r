const { query } = require("./query");

test();

function test() {
  // todo

  let list = `
    120.24.78.68
    192.168.1.10
    163.125.210.27
    2409:8970:2f5d:2641:cf6:ebff:feda:abac
    124.220.36.180
    223.104.206.33
    2408:8456:f10c:a4fd:9925:5858:55aa:33af
    2409:891f:6864:a3ba:100e:5b26:3feb:fc26
    39.144.104.45
    2409:8904:a730:1b4c:1d68:6d5d:e915:7d20
    106.55.202.118
    183.47.120.213
    43.247.132.52
    123.139.60.47
  `;
  for (let ip of list.split("\n")) {
    ip = ip.trim();
    if (!ip) continue;
    let res = query(ip);
    console.log(ip, res);
  }
}
