import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OnlinePlayers } from 'src/app/classes/online-players';
import { InviteService } from 'src/app/services/inviteService/invite.service';

import socket from 'src/app/socket';

@Component({
  selector: 'app-toinvite',
  templateUrl: './toinvite.component.html',
  styleUrls: ['./toinvite.component.scss']
})
export class ToinviteComponent implements OnInit, OnDestroy {
  Object = Object;
  idlePlayers: any;
  backupIdlePlayers: any;

  constructor(private dialogRef: MatDialogRef<ToinviteComponent>, private sentInvitesManager: InviteService) { 
    this.idlePlayers = {};
    this.backupIdlePlayers = {};
  }

  invite(userid: string){
    this.sentInvitesManager.invitedPeople[userid] = userid;
    this.idlePlayers[userid].invited = true;
    this.backupIdlePlayers[userid].invited = true;
    socket.emit("INVITE_PLAYER", userid);
  }

  closeDialog(){
    this.dialogRef.close();
  }

  searchByPlayerName(arg: any){
    let testString = arg.value;

    if (testString == "") {
      this.idlePlayers = this.backupIdlePlayers;
    } else {
      let temp = this.backupIdlePlayers;
      for (let userid in temp) {
        if (temp[userid].roomname.match(new RegExp(testString, "g")) == null) {
          delete this.idlePlayers[userid];
        }
      }
    }
  }

  ngOnInit(): void {

    socket.emit("GET_IDLE_PLAYERS");

      socket.on("IDLE_PLAYERS_LIST", (data)=>{
        for(let p of data){
          this.idlePlayers[p.userid] = new OnlinePlayers(p.username, p.userid);
          this.backupIdlePlayers[p.userid] = new OnlinePlayers(p.username, p.userid);
  
          if(this.sentInvitesManager.invitedPeople[p.userid]!=undefined){
            this.idlePlayers[p.userid].invited = true;
            this.backupIdlePlayers[p.userid].invited = true;
          }
        }
      });
  
      socket.on("IDLE_LEFT", (userid)=>{
        delete this.idlePlayers[userid];
        delete this.backupIdlePlayers[userid];
        delete this.sentInvitesManager.invitedPeople[userid];
      });
  
      socket.on("NEW_JOINING", (data)=>{
        this.idlePlayers[data.userid] = new OnlinePlayers(data.username, data.userid);
        this.backupIdlePlayers[data.userid] = new OnlinePlayers(data.username, data.userid);
        delete this.sentInvitesManager.invitedPeople[data.userid];
      });
  }

  ngOnDestroy(): void {
    socket.off("IDLE_PLAYERS_LIST");
    socket.off("IDLE_LEFT");
    socket.off("NEW_JOINING");
  }


}
