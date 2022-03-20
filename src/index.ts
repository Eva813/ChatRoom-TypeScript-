import devServer from "./server/dev";
import prodServer from "./server/prod";
import express from "express";
import { Server } from "socket.io"
import http from "http"

import { name } from "@/utils";


const port = 3000;
const app = express();
//透過 http 將 server 建立起來
const server = http.createServer(app)
const io = new Server(server)

//當有用戶連接到connection 就會有回呼函式
//2. 監測連接
io.on('connection', (socket) => {
  socket.emit('join', 'Welcom')

  //建立連接時，使用on 對應監聽的頻道 收到chatRoom 的訊息
  socket.on('chat', (msg) => {
    console.log('mssege:', msg)
    //發到後端後，再由後端返回給前端
    io.emit('chat', msg)
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
