import { Injectable } from '@angular/core';
import { Chat } from 'src/app/classes/chat';
import { Player } from 'src/app/classes/player';
import { GAMETYPE } from 'src/app/enum/gametype.enum';
import { ROOMTYPE } from 'src/app/enum/roomtype.enum';

@Injectable({
  providedIn: 'root'
})
export class OnlineManagerService {

  playerHost: boolean;
  roomname: string;
  roomid: string;
  roomtype: ROOMTYPE;
  players: Player[];
  chats: Chat[];
  gametype: GAMETYPE;
  locked: boolean;

  constructor() { 
    this.roomtype = ROOMTYPE.NONE;
    this.players = [];
    this.chats = [];
    this.roomname = "";
    this.roomid = "";
    this.locked = false;
    this.gametype = GAMETYPE.CLASSIC;
    this.playerHost = false;
  }

  resetManager(){
    this.roomtype = ROOMTYPE.NONE;
    this.players = [];
    this.chats = [];
    this.roomname = "";
    this.roomid = "";
    this.gametype = GAMETYPE.CLASSIC;
    this.locked = false;
    this.playerHost = false;
  }


}
