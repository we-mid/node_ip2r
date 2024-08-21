package main

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
	"time"
)

type Req struct {
	IP string
	// 更多控制参数可拓展
}
type Res struct {
	IP     string
	Region string
	Took   time.Duration
	// todo more
}

const sock = "/tmp/node_ip2r.unix.sock"

func main() {
	// 连接到 Unix Domain Socket 服务器
	conn, err := net.Dial("unix", sock)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to connect to socket: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close()

	go func() {
		// 读取响应
		var response Res
		decoder := json.NewDecoder(conn)
		for {
			if err := decoder.Decode(&response); err != nil {
				fmt.Fprintf(os.Stderr, "Failed to decode response: %v\n", err)
				os.Exit(1)
			}
			fmt.Printf("Received response: %+v\n", response)
		}
	}()

	for {
		// 构建请求
		request := Req{"2409:891f:6864:a3ba:100e:5b26:3feb:fc26"}
		// 序列化请求并发送
		jsonRequest, err := json.Marshal(request)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to marshal request: %v\n", err)
			os.Exit(1)
		}
		conn.Write(jsonRequest)
		// sleep
		<-time.After(3 * time.Second)
	}
}
