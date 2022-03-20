import "./index.css";
import { name } from "@/utils";
//將 socket.io 的包引入前端程式這邊
import { io } from "socket.io-client";

//在進入頁面時，從url 拿到 querry string 的資訊
//使用 window 的API
const url = new URL(location.href)
const userName = url.searchParams.get('user_name')
const roomName = url.searchParams.get('room_name')

//加入沒有取得資訊，要跳轉登入頁
if (!userName || !roomName) {
  location.href = "/main/main.html"
}
console.log(userName, roomName)

//1. 建立連接到 node server
const clientIo = io();
//建立連接成功，接收後端發過來的訊息
clientIo.on('join', (msg) => {
  console.log('msg', msg)
})


console.log("client side chatroom page", name);
