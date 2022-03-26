import devServer from "@/server/dev";
import prodServer from "@/server/prod";
import express from "express";
import { Server } from "socket.io"
import http from "http"

import { name } from "@/utils";
import UserService from "@/service/UserService";


const port = 3000;
const app = express();
//透過 http 將 server 建立起來
const server = http.createServer(app)
const io = new Server(server)
const userService = new UserService



//當有用戶連接到connection 就會有回呼函式
//2. 監測連接
io.on('connection', (socket) => {
  //socket.emit('join', 'Welcom')
  socket.on('join', ({ userName, roomName }: { userName: string, roomName: string }) => {
    //在進入聊天室同時，建立用戶資訊
    const userData = userService.userDataInfoHandler(
      socket.id,
      userName,
      roomName
    )

    //soket join 和 to 是對應一起的
    socket.join(userData.roomName)

    //將user 存入
    userService.addUser(userData)

    //運用 socket 的 broadcast 功能
    //to 就是，我們 socket.join 加入了特定房間，並告訴 socket 就發送到該房間就好
    socket.broadcast.to(userData.roomName).emit('join', `${userName} join ${roomName}`)

  })


  //建立連接時，使用on 對應監聽的頻道 收到chatRoom 的訊息
  socket.on('chat', (msg) => {
    console.log('mssege:', msg)
    //在這裡發到後端後，再由後端返回給前端
    io.emit('chat', msg)
  })

  //用sokit io 中斷開連結
  socket.on('disconnect', () => {
    const userData = userService.getUser(socket.id)
    //加問號是因為有 null 的型別可能存在
    const userName = userData?.userName
    //接著就是 如果 userName 是有存在，就能發送
    if (userName) {
      socket.broadcast.to(userData.roomName).emit('leave', `${userData.userName} leave`)
    }
    //同時來開的話，後端也要將 user 的資訊 remove 
    userService.removeUser(socket.id)

  })
})

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === "development") {
  devServer(app);
} else {
  prodServer(app);
}

console.log("server side", name);

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
