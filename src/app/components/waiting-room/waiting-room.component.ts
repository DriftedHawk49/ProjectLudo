import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Player } from 'src/app/classes/player';
import { GAMETYPE } from 'src/app/enum/gametype.enum';
import { ROOMTYPE } from 'src/app/enum/roomtype.enum';
import { GameService } from 'src/app/services/gameService/game.service';
import { InviteService } from 'src/app/services/inviteService/invite.service';
import { OnlineManagerService } from 'src/app/services/onlineManagerService/online-manager.service';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';
import socket from 'src/app/socket';
import { ToinviteComponent } from '../modals/toinvite/toinvite.component';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss']
})
export class WaitingRoomComponent implements OnInit, OnDestroy {

  notConnected: number[];
  colors: number[];

  constructor(private _snackbar: MatSnackBar, private router: Router, public user: UserManagerService, private dialog: MatDialog, public manager: OnlineManagerService, private sentInvitesManager: InviteService, private gameManager: GameService) {

    this.notConnected = [];
    this.colors = [1, 2, 3, 4];

  }


  openInviteDialog() {
    this.dialog.open(ToinviteComponent, {
      panelClass: "modalClass",
      autoFocus: false,
      closeOnNavigation: true
    })
  }

  startGame() {
    if (this.manager.players.length > 1) {
        socket.emit("START_GAME");
    }
  }

  changeGameMode(arg: number) {
    socket.emit("GAME_MODE_CHANGE", arg);
  }

  toggleLock(evt: any) {
    socket.emit("LOCK_STATUS_CHANGE", evt.checked);
  }

  updateNotConnected() {
    let col = [];
    this.notConnected = [];
    for (let player of this.manager.players) {
      col.push(player.color);
    }
    for (let c of this.colors) {
      if (!col.includes(c)) {
        this.notConnected.push(c);
      }
    }

  }

  

  ngOnInit(): void {


    socket.on("SOMEONE_JOINED", (data) => {
      // console.log(data);
      let p = new Player(data.username, this.manager.roomtype, data.color, false, data.userid, this.manager.roomid, true, true);
      this.manager.players.push(p);
      this.updateNotConnected();
    });

    socket.on("HOST_DISCONNECTED", () => {
      this.manager.resetManager();
      this._snackbar.open("Host Disconnected!", "OK", {
        duration: 2000
      });
      this.router.navigateByUrl("onlinegame");
    });

    socket.on("PLAYER_LEFT", (data) => {
      let j = -1;

      delete this.sentInvitesManager.invitedPeople[data.toRemove];

      // console.log(data);

      for (let i = 0; i < this.manager.players.length; i++) {
        if (this.manager.players[i].userid == data.toRemove) {
          j = i;
          break;
        }
      }

      this.manager.players.splice(j, 1);

      for (let i = 0; i < this.manager.players.length; i++) {
        if (this.manager.players[i].userid == data.players[i].userid) {
          this.manager.players[i].color = data.players[i].color;
        }
      }

      this.updateNotConnected();
    });

    socket.on("GAME_MODE_CHANGED", (mode) => {
      this.manager.gametype = mode;
    });

    socket.on("LOCK_STATUS_CHANGED", (status) => {
      this.manager.locked = status;
    });

    socket.on("GAME_STARTED", (data)=>{
      
      let pl: Player[] = [];

      for(let p of data.players){
        let f = new Player(p.username, 2, p.color, p.host, p.userid, this.manager.roomid, true, true);
        pl.push(f);
      }

      if(data.gametype==2){
        this.gameManager.createClassicGame(pl, false, this.manager.roomname, this.manager.roomid);
        this.router.navigateByUrl("onlineclassic");
      }else{
        this.gameManager.createMiniGame(pl, false, this.manager.roomname, this.manager.roomid);
        this.router.navigateByUrl("onlinemini");
      }
    });

    socket.on("MUTE_CHANGED", (data)=>{
      for(let i =0;i<this.manager.players.length; i++){
        if(this.manager.players[i].userid==data.userid){
          this.manager.players[i].mute = data.status;
        }
      }
    });

    this.updateNotConnected();
  }

  ngOnDestroy(): void {
    socket.off("SOMEONE_JOINED");
    socket.off("HOST_DISCONNECTED");
    socket.off("PLAYER_LEFT");
    socket.off("GAME_MODE_CHANGED");
    socket.off("LOCK_STATUS_CHANGED");
    socket.off("GAME_STARTED");
    socket.off("MUTE_CHANGED");
    this.manager.resetManager();
  }

}
