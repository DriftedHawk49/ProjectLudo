import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GameService } from 'src/app/services/gameService/game.service';
import { InviteService } from 'src/app/services/inviteService/invite.service';
import { OnlineManagerService } from 'src/app/services/onlineManagerService/online-manager.service';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';
import socket from 'src/app/socket';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild("chatContainer")
  chatContainer!: ElementRef;

  messenger: FormGroup;
  constructor(private dialogRef: MatDialogRef<ChatComponent>, public chatManager: InviteService, public user: UserManagerService, private manager: OnlineManagerService, private controller: GameService) {


    this.messenger = new FormGroup({
      textChat: new FormControl("", [Validators.required, Validators.maxLength(50)])
    });
  }
  
  ngAfterViewInit(): void {
    this.chatContainer.nativeElement.scrollTo(0, this.chatContainer.nativeElement.scrollHeight);
  }

  get textChat() {
    return this.messenger.get("textChat");
  }

  closeDialog() {
    this.dialogRef.close();
  }

  sendText() {
    if(!this.messenger.invalid){

      let color = 0;
      if(this.controller.players.length == 0){
        for(let p of this.manager.players){
          if(p.userid==this.user.userid){
            color = p.color;
            break;
          }
        }
      }else{
        for(let p of this.controller.players){
          if(p.userid==this.user.userid){
            color=p.color;
            break;
          }
        }
      }
      let payload = {
        message: this.messenger.get("textChat")?.value,
        sendername: this.user.username,
        senderid: this.user.userid,
        sendercolor: color
      }
      

      socket.emit("SEND_TEXT", payload);

      this.messenger.get("textChat")?.reset();
      setTimeout(()=>{
        this.chatContainer.nativeElement.scrollTo(0, this.chatContainer.nativeElement.scrollHeight);
      }, 1000);
    }
  }

  ngOnInit(): void {


  }

}
