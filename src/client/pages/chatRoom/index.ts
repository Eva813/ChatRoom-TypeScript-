import "./index.css";
import { name } from "@/utils";
//將 socket.io 的包引入前端程式這邊
import { io } from "socket.io-client";
import { UserData } from '@/service/UserService'

type userMsg = { userData: UserData, msg: string, time: number }

//在進入頁面時，從url 拿到 querry string 的資訊
//使用 window 的API
const url = new URL(location.href)
const userName = url.searchParams.get('user_name')
const roomName = url.searchParams.get('room_name')
let userID = ''

//加入沒有取得資訊，要跳轉登入頁
if (!userName || !roomName) {
  location.href = "/main/main.html"
}
//console.log(userName, roomName)


//1. 建立連接到 node server
const clientIo = io();

// clientIo.emit('join', `${userName} join ${roomName}`)
clientIo.emit('join', { userName, roomName })

const textInput = document.getElementById("textInput") as HTMLInputElement
const submitButton = document.getElementById("submitBtn") as HTMLButtonElement
const chatBoard = document.getElementById("chatBoard") as HTMLDivElement
const headerRoomName = document.getElementById("headerRoomName") as HTMLParagraphElement
const backButton = document.getElementById("backButton") as HTMLButtonElement

headerRoomName.innerHTML = roomName || ' - '


function msgHandler(data: userMsg) {
  console.log(data.time)
  //使用 new data 來轉換
  const date = new Date(data.time)
  const time = `${date.getHours()}:${date.getMinutes()}`
  console.log(date, time)


  const divBox = document.createElement("div");
  divBox.classList.add('flex', 'mb-4', 'items-end')
  if (data.userData.id === userID) {
    divBox.classList.add('justify-end')
    divBox.innerHTML = `
      <p class="text-xs text-gray-700 mr-4"> ${time} </p>

      <div>
      <p class="text-xs text-white mb-1 text-right" > ${data.userData.userName} </p>
        <p class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full" >
          ${data.msg}
      </p>
    </div>
  `
  } else {
    divBox.classList.add('justify-start')
    divBox.innerHTML = `
      <div>
        <p class="text-xs text-gray-700 mb-1">${data.userData.userName}</p>
        <p
          class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-tl-full text-white">
          ${data.msg}
        </p>
      </div>

      <p class="text-xs text-gray-700 ml-4">${time}</p>
    `
  }

  chatBoard.appendChild(divBox)
  textInput.value = ''
  //使聊天版會自動滾到下面，顯示最新訊息
  chatBoard.scrollTop = chatBoard.scrollHeight

}

function roomMsgHandler(msg: string) {
  const divBox = document.createElement("div")
  divBox.classList.add('flex', 'justify-center', 'mb-4', 'items-center')
  divBox.innerHTML = `
    <p class="text-gray-700 text-sm">${msg}</p>
  `
  chatBoard.appendChild(divBox)
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
clientIo.on('join', (msg: string) => {
  console.log('join', msg);
  roomMsgHandler(msg)
})


//接收後端返回前端的資訊
clientIo.on('chat', (data: userMsg) => {
  console.log('cliten-msg:', data.msg)
  msgHandler(data)

})

clientIo.on('leave', (msg) => {
  console.log('leave-msg:', msg)
  roomMsgHandler(msg)

})

clientIo.on('userID', (id) => {
  userID = id
})


//console.log("client side chatroom page", name);
