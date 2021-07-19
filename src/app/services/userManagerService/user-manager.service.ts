import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {

  username: string|null;
  userid: string|null;


  constructor() {
    this.username = localStorage.getItem("username");
    this.userid = localStorage.getItem("userid");
  }

  setUserName(name: string){
    this.username = name;
    localStorage.setItem("username", name);
  }

  setUserID(id: string){
    this.userid = id;
    localStorage.setItem("userid", id);
  }
}
