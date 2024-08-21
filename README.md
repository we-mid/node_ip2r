# `node_ip2r` IP归属地信息查询 Node.js服务

See also:

- https://gitee.com/we-mid/go/blob/main/ip2r/README.md
- https://github.com/yourtion/node-ip2region

当前 node_ip2r 提供的服务交互，使用的是 Unix Socket IPC 策略实现

```sh
git clone git@gitee.com:we-mid/node_ip2r.git
cd node_ip2r
pnpm install
node server
>> Server listening on Unix Domain Socket at /tmp/node_ip2r.unix.sock
New client connected.
Received request: {"IP":"2409:891f:6864:a3ba:100e:5b26:3feb:fc26"}
...
Client disconnected.

# 另外一个命令行窗口
go run .  #
>> Received response:
{IP:2409:891f:6864:a3ba:100e:5b26:3feb:fc26 Region:中国上海市 中国移动CMNET网络 Took:1ms}
```
