package main

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
)

type Message struct {
	Type  string `json:"type"`
	Value string `json:"value"`
}

func main() {
	// 连接到 Unix Domain Socket 服务器
	conn, err := net.Dial("unix", "/tmp/unix.socket")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to connect to socket: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close()

	// 构建请求
	request := Message{
		Type:  "request",
		Value: "Hello from Go!",
	}

	// 序列化请求并发送
	jsonRequest, err := json.Marshal(request)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to marshal request: %v\n", err)
		os.Exit(1)
	}
	conn.Write(jsonRequest)

	// 读取响应
	var response Message
	err = json.NewDecoder(conn).Decode(&response)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to decode response: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Received response: %+v\n", response)
}
