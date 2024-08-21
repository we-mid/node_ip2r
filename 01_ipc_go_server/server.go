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
	// 删除可能存在的旧 socket 文件
	err := os.Remove("/tmp/unix.socket")
	if err != nil && !os.IsNotExist(err) {
		fmt.Fprintf(os.Stderr, "Failed to remove old socket file: %v\n", err)
		os.Exit(1)
	}

	// 创建 Unix Domain Socket 服务器
	listener, err := net.Listen("unix", "/tmp/unix.socket")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to listen on socket: %v\n", err)
		os.Exit(1)
	}
	defer listener.Close()

	for {
		// 接受新的连接
		conn, err := listener.Accept()
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to accept connection: %v\n", err)
			continue
		}

		go handleConnection(conn)
	}
}

func handleConnection(conn net.Conn) {
	defer conn.Close()

	// 读取客户端发来的消息
	var request Message
	err := json.NewDecoder(conn).Decode(&request)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to decode request: %v\n", err)
		return
	}

	fmt.Printf("Received request: %+v\n", request)

	// 处理请求并构建响应
	response := Message{
		Type:  "response",
		Value: fmt.Sprintf("Response to your '%s' request", request.Value),
	}

	// 发送响应
	err = json.NewEncoder(conn).Encode(response)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to encode response: %v\n", err)
		return
	}
}
