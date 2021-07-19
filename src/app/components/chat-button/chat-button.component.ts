import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Chat } from 'src/app/classes/chat';
import { InviteService } from 'src/app/services/inviteService/invite.service';
import socket from 'src/app/socket';
import { ChatComponent } from '../modals/chat/chat.component';


@Component({
  selector: 'app-chat-button',
  templateUrl: './chat-button.component.html',
  styleUrls: ['./chat-button.component.scss']
})
export class ChatButtonComponent implements OnInit, OnDestroy {

  newChats: number;
  constructor(private chatManager: InviteService, private dialog: MatDialog) { 

    this.newChats = 0;
  }
 


  openChatBox(){
    this.newChats = 0;
    let ref = this.dialog.open(ChatComponent, {
      panelClass: "modalClass",
      closeOnNavigation: true
    });

    ref.afterOpened().subscribe(()=>{
      this.newChats = 0;
    })
    ref.afterClosed().subscribe(()=>{
      this.newChats = 0;
    })
  }

  ngOnInit(): void {

      // Enter all the socket events here

      socket.on("NEW_CHAT", (payload)=>{
        let newChat: Chat = new Chat(payload.sendername, payload.message, payload.sendercolor, payload.senderid);
        this.chatManager.chats.push(newChat);
        this.newChats++;
        console.log(this.newChats);
        console.log("NEW CHAT NUMBER : ", this.newChats);
        // Add chat sound que
      });
  }

  ngOnDestroy(): void {
    socket.off("NEW_CHAT");
  }

}
