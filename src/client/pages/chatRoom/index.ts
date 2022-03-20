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
//console.log(userName, roomName)


//1. 建立連接到 node server
const clientIo = io();


const textInput = document.getElementById("textInput") as HTMLInputElement
const submitButton = document.getElementById("submitBtn") as HTMLButtonElement
const chatBoard = document.getElementById("chatBoard") as HTMLDivElement
const headerRoomName = document.getElementById("headerRoomName") as HTMLParagraphElement
const backButton = document.getElementById("backButton") as HTMLButtonElement

headerRoomName.innerHTML = roomName || ' - '


function msgHandler(msg: string) {
  // <div class="flex justify-end mb-4 items-end" >
  //   <p class="text-xs text-gray-700 mr-4" > 00: 00 < /p>

  //     < div >
  //     <p class="text-xs text-white mb-1 text-right" > Bruce < /p>
  //       < p class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full" >
  //         嗨嗨嗨！
  // </p>
  //   < /div>
  //   < /div>
  const divBox = document.createElement("div");
  divBox.classList.add('flex', 'justify-end', 'mb-4', 'items-end')
  divBox.innerHTML = `
      <p class="text-xs text-gray-700 mr-4"> 00: 00 </p>

      <div>
      <p class="text-xs text-white mb-1 text-right" > Bruce </p>
        <p class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full" >
          ${msg}
      </p>
    </div>
  `
  chatBoard.appendChild(divBox)
  textInput.value = ''
  //使聊天版會自動滾到下面，顯示最新訊息
  chatBoard.scrollTop = chatBoard.scrollHeight

}

submitButton.addEventListener("click", () => {
  const textValue = textInput.value
  //將拿到的 value 推送到後端，透過clientIo 
  //'chat' => 指一個事件的概念
  clientIo.emit('chat', textValue)
})

backButton.addEventListener('click', () => {
  location.href = "/main/main.html"
})

//建立連接成功，接收後端發過來的訊息
// clientIo.on('join', (msg) => {
//   console.log('msg', msg)
// })

//接收後端返回前端的資訊
clientIo.on('chat', (msg) => {
  console.log('cliten-msg:', msg)
  msgHandler(msg)
})



console.log("client side chatroom page", name);
