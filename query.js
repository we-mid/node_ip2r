let IP2Region = require("ip2region").default;
let ip2r = new IP2Region();

exports.query = query;

function query(ip) {
  ip = (ip || "").trim();
  if (!ip) return null;
  let o = patch(ip) || ip2r.search(ip);
  return normalize(o);
}

function patch(ip) {
  if (isIPv4(ip)) {
    // fix
    if (isIPv4InRange(ip, "124.220.0.0", "124.223.255.255")) {
      return {
        country: "中国",
        province: "上海市",
        isp: "腾讯云 数据中心",
      };
    }
    // improve
    if (isIPv4InRange(ip, "106.55.88.0", "106.55.255.255")) {
      return {
        country: "中国",
        province: "广东省",
        city: "广州市",
        isp: "腾讯云 数据中心",
      };
    }
    if (isIPv4InRange(ip, "163.125.210.0", "163.125.210.255")) {
      return {
        country: "中国",
        province: "广东省",
        city: "深圳市",
        district: "光明区",
        isp: "联通 城域网",
      };
    }
    // missing
    if (isIPv4InRange(ip, "39.144.103.0", "39.144.107.255")) {
      return {
        country: "中国",
        province: "上海市",
        district: "浦东新区",
        isp: "移动 城域网",
      };
    }
  }
}

function normalize(o) {
  // let r = Object.assign({}, o);
  // ["country", "province", "city", "isp", "district"].forEach((k) => {
  //   r[k] = r[k] || "";
  // });
  // return r;
  return o;
}

function isIPv4(ip) {
  return /\d+(\.\d+){3}/.test(ip);
}

function isIPv4InRange(ip, startIp, endIp) {
  var ipLong = ipToLong(ip);
  var startLong = ipToLong(startIp);
  var endLong = ipToLong(endIp);
  return ipLong >= startLong && ipLong <= endLong;
}

function ipToLong(ip) {
  var parts = ip.split(".");
  // return ( // buggy 有概率变字符串
  //   (parts[0] || 0) * 16777216 +
  //   (parts[1] || 0) * 65536 +
  //   (parts[2] || 0) * 256 +
  //   (parts[3] || 0)
  // );
  return (
    Math.round(+parts[0] * 16777216) +
    Math.round(+parts[1] * 65536) +
    Math.round(+parts[2] * 256) +
    Math.round(+parts[3])
  );
}
