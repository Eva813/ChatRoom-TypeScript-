export type UserData = {
  id: string;
  userName: string;
  roomName: string
}

//使用 private 不被外面訪問

export default class UserService {
  //map 用來記錄使用者資訊
  private userMap: Map<string, UserData>

  //constructor ： 當class在建立的時候，才去做的事
  //所以可以直接拿到 userMap ，並將userMap 建立起來
  constructor() {
    this.userMap = new Map();
  }

  //新增user功能
  addUser(data: UserData) {
    this.userMap.set(data.id, data)
  }

  removeUser(id: string) {
    if (this.userMap.has(id)) {
      this.userMap.delete(id)
    }
  }

  //讓外面可以拿到使用者資訊
  getUser(id: string) {
    if (!this.userMap.has(id)) return null
    //get 要去對應上面set的key
    const data = this.userMap.get(id)
    if (data) {

      return data;
    }
    return null
  }

  //回傳userData的內容

  userDataInfoHandler(id: string, userName: string, roomName: string): UserData {
    return {
      id,
      userName,
      roomName
    }
  }
}
