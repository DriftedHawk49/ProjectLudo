import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Player } from 'src/app/classes/player';
import { COLOR } from 'src/app/enum/color.enum';
import { GAMETYPE } from 'src/app/enum/gametype.enum';
import { ROOMTYPE } from 'src/app/enum/roomtype.enum';
import { GameService } from 'src/app/services/gameService/game.service';
import { InviteService } from 'src/app/services/inviteService/invite.service';
import { OnlineManagerService } from 'src/app/services/onlineManagerService/online-manager.service';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';
import socket from 'src/app/socket';

@Component({
  selector: 'app-gameover',
  templateUrl: './gameover.component.html',
  styleUrls: ['./gameover.component.scss']
})
export class GameoverComponent implements OnInit, OnDestroy {

  currentPlayer: any | Player;

  constructor(private manager: OnlineManagerService, private inviteManager: InviteService, private router: Router, public controller: GameService, public user: UserManagerService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {

    let pl = [];
    let r = 1;
    let rp = [];


    if (!this.controller.offline) {
      for (let p of this.controller.players) {
        if (p.rank != -1) {
          rp.push(p);
        }

        if (this.user.userid == p.userid) {
          this.currentPlayer = p;
        }
      }
    } else {
      rp = this.controller.players;
    }

    let i = 0;
    while (r != rp.length + 1) {
      if (r == rp[i].rank) {
        pl.push(rp[i]);
        r++;
      }

      if (i == rp.length - 1) {
        i = 0
      } else {
        i++;
      }
    }

    this.controller.players = pl;
    this.controller.noOfPlayers = pl.length;

    socket.on("HOST_CHANGED", (payload) => {
      payload.disconnected
      payload.newHost

      if (payload.newHost == this.currentPlayer.userid) {
        this.currentPlayer.host = true;
      }

      for (let i = 0; i < this.controller.players.length; i++) {
        this.controller.players[i].host = false;

        if (this.controller.players[i].userid == payload.disconnected) {
          this.controller.players[i].online = false;
          this._snackbar.open("Player Left. Host is changed.", "OK", {
            duration: 2000
          });

        }
        if (this.controller.players[i].userid == payload.newHost) {
          this.controller.players[i].host = true;
        }
      }

    });

    socket.on("INGAME_PLAYER_LEFT", (puserid) => {
      for (let i = 0; i < this.controller.players.length; i++) {
        if (this.controller.players[i].userid == puserid) {
          this.controller.players[i].online = false;
          this._snackbar.open(`${this.controller.players[i].username} left.`, "OK", {
            duration: 2000
          });
        }
      }
    });

    socket.on("RESTART", (payload) => {
      this.inviteManager.reset();
      this.controller.resetParameters();
      this.manager.resetManager();
      this.manager.roomname = payload.roomname;
      this.manager.roomid = payload.roomid;

      let wp: Player[] = [];

      for (let p of payload.players) {
        wp.push(new Player(p.username, ROOMTYPE.WAITING, p.color, p.host, p.userid, payload.roomid, true, true));
        if (p.userid == this.user.userid) {
          if (p.host) {
            this.manager.playerHost = true;
            socket.emit("LOCK_STATUS_CHANGE", true);
            socket.emit("GAME_MODE_CHANGE", GAMETYPE.CLASSIC);
            socket.emit("ENTER_WAITING_AREA");
          }
        }
      }
      this.manager.players = wp;
      this.manager.gametype == GAMETYPE.CLASSIC;
      this.manager.roomtype == ROOMTYPE.WAITING;
      this.manager.locked = true;

      this.router.navigateByUrl("waiting");
    });

    socket.on("EVERYONE_LEFT", () => {
      this.controller.resetParameters();
      this.inviteManager.reset();
      this.manager.resetManager();
      this.router.navigateByUrl("onlinegame");
    });
    socket.on("MUTE_CHANGED", (data) => {
      for (let i = 0; i < this.manager.players.length; i++) {
        if (this.manager.players[i].userid == data.userid) {
          this.manager.players[i].mute = data.status;
        }
      }
    });

  }

  endGame() {
    this.inviteManager.reset();
    this.controller.resetParameters();
    this.manager.resetManager();
    socket.disconnect();
    this.router.navigateByUrl("");
  }

  playAgain() {
    if (this.controller.offline) {
      let np = this.controller.players;
      let rn = this.controller.roomname;
      this.controller.resetParameters();
      if (this.controller.gametype == GAMETYPE.CLASSIC) {
        this.controller.createClassicGame(np, true, rn);
      } else {
        this.controller.createMiniGame(np, true, rn);
      }
    } else {
      // START HERE FOR ONLINE GAME MODE. TAKE PEOPLE TO WAITING AREA, MAINTAIN PLAYER BASE ONLY, reset everything else. 
      // DO IT LATER WHEN ONLINE MODE IS READY.

      if (this.currentPlayer.host) {
        socket.emit("ROOM_DETAILS");
      }

    }
  }

  ngOnDestroy() {
    socket.off("RESTART");
    socket.off("INGAME_PLAYER_LEFT");
    socket.off("HOST_CHANGED");
    socket.off("EVERYONE_LEFT");
    socket.off("MUTE_CHANGED");
  }

}
