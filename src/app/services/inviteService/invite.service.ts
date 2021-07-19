import { Injectable } from '@angular/core';
import { Chat } from 'src/app/classes/chat';
import { Invites } from 'src/app/classes/invites';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  invitations: Invites[];
  chats: Chat[];
  invitedPeople: any;

  constructor() {
    this.chats = [];
    this.invitations = [];
    this.invitedPeople = {};
   }

   reset(){
     this.chats = [];
     this.invitations = [];
     this.invitedPeople = {};
   }
}
