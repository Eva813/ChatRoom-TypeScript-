import "./index.css";
import { name } from "@/utils";
//將 socket.io 的包引入前端程式這邊
import { io } from "socket.io-client";

//1. 建立連接到 node server
const clientIo = io();
//建立連接成功，接收後端發過來的訊息
clientIo.on('join', (msg) => {
  console.log('msg', msg)
})


console.log("client side chatroom page", name);
