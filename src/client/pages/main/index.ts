import "./index.css";
import { name } from "@/utils";

//取得DOM 元素
const nameInput = document.getElementById("nameInput") as HTMLInputElement;
const nameSelect = document.getElementById("nameSelect") as HTMLSelectElement;
const startBtn = document.getElementById("startBtn") as HTMLButtonElement;

//拿
startBtn.addEventListener("click", () => {
  const userName = nameInput.value;
  const roomName = nameSelect.value;
  console.log('userName', userName, roomName);
  //跳轉到該頁面 > 查看 dev.ts 中的路徑名
  location.href = `/chatRoom/chatRoom.html?user_name=${userName}&room_name=${roomName}`
  //location.href = `/chatRoom`
})


//在按鈕加入事件
