import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Invites } from 'src/app/classes/invites';
import { Player } from 'src/app/classes/player';
import { Rooms } from 'src/app/classes/rooms';
import { COLOR } from 'src/app/enum/color.enum';
import { GAMETYPE } from 'src/app/enum/gametype.enum';
import { ROOMTYPE } from 'src/app/enum/roomtype.enum';
import { InviteService } from 'src/app/services/inviteService/invite.service';
import { OnlineManagerService } from 'src/app/services/onlineManagerService/online-manager.service';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';
import socket from 'src/app/socket';
import { FindRoomsComponent } from '../modals/find-rooms/find-rooms.component';
import { InvitesComponent } from '../modals/invites/invites.component';

let connection: boolean = false;


@Component({
  selector: 'app-online-game-select',
  templateUrl: './online-game-select.component.html',
  styleUrls: ['./online-game-select.component.scss']
})
export class OnlineGameSelectComponent implements OnInit, OnDestroy {

  createRoomForm: FormGroup;
  joinRoomForm: FormGroup;
  roomNos: number;
  openRooms: any;

  constructor(public invitations: InviteService, private _snackbar: MatSnackBar, private router: Router, private manager: OnlineManagerService, private dialog: MatDialog, private user: UserManagerService) {


    // console.error("CONSTRUCTOR CALLED");
    this.createRoomForm = new FormGroup({
      roomname: new FormControl("", [Validators.required, Validators.maxLength(15)])
    });

    this.joinRoomForm = new FormGroup({
      roomcode: new FormControl("", [Validators.required, Validators.maxLength(8)])
    });

    this.roomNos = 0;
    this.openRooms = {};
  }

  get roomname() {
    return this.createRoomForm.get("roomname");
  }

  get roomcode() {
    return this.joinRoomForm.get("roomcode");
  }

  createNewRoom() {
    socket.emit("CREATE_ROOM", {
      roomname: this.roomname?.value
    });
  }

  joinRoom() {
    // console.log(this.roomcode?.value);
    socket.emit("JOIN_ROOM", {
      roomid: this.roomcode?.value
    });
  }

  findRooms() {
    this.dialog.open(FindRoomsComponent, {
      panelClass: "modalClass",
      autoFocus: false,
      closeOnNavigation: true
    });
  }

  checkInvites() {
    this.dialog.open(InvitesComponent, {
      panelClass: "modalClass",
      autoFocus: false,
      closeOnNavigation: true,
      data: this.invitations
    });
  }



  ngOnInit(): void {
    // console.warn("NGONINIT of game select CALLED.");
    // console.log(this.manager);
    this.manager.resetManager();
    this.invitations.reset();

    // console.error("NG ON INIT CALLED");

    if (!connection) {
      socket.auth = {
        username: this.user.username,
        userid: this.user.userid
      }
      socket.connect();
      socket.on("CONNECTION_SUCCESSFUL", () => {
        console.log("Connected To Server.");
      });
      connection = true;
    }


    socket.on("OPEN_ROOMS", (data) => {
      this.openRooms = {};
      this.roomNos = data.length;
      for (let room of data) {
        this.openRooms[room.roomid] = (new Rooms(room.roomname, room.roomid, room.noOfPlayers));
      }
    });

    socket.on("ROOM_LOCKED", (roomid) => {
      if (this.openRooms[roomid] != undefined) {
        delete this.openRooms[roomid];
        this.roomNos--;

      }
    });

    socket.on("ROOM_UNLOCKED", (data) => {
      this.openRooms[data.roomid] = new Rooms(data.roomname, data.roomid, data.noOfPlayers);
      this.roomNos++;
    });

    socket.on("INVITATION", (data) => {
      // START FROM HERE.
      // console.log("INVITATION RECEIVED");
      let invi = new Invites(data.roomid, data.roomname, data.noOfPlayers, data.sendername);
      this.invitations.invitations.push(invi);

      let snacky = this._snackbar.open(`${data.sendername} is inviting you to play!`, "JOIN");
      snacky.onAction().subscribe(() => {
        // console.error("JOIN ACTION TAKEN");
        socket.emit("JOIN_ROOM", { roomid: data.roomid });
        this.invitations.invitations.pop();
      });
    });

    socket.on("NEW_ROOM", (data: any) => {
      let yp = new Player(String(this.user.username), ROOMTYPE.WAITING, COLOR.YELLOW, true, String(this.user.userid), data.roomid, true, true);
      // Add player to list
      this.manager.players.push(yp);
      this.manager.roomid = data.roomid;
      this.manager.roomname = data.roomname;
      this.manager.gametype = GAMETYPE.CLASSIC;
      this.manager.locked = true;
      this.manager.roomtype = ROOMTYPE.WAITING;
      this.manager.playerHost = true;
      // console.log(data);
      this.router.navigateByUrl("waiting");
    });

    socket.on("JOIN_SUCCESS", (data: any) => {
      // console.error(new Date());
      this.invitations.invitations = [];
      // console.log(data);
      this.manager.roomname = data.roomname;
      this.manager.roomid = data.roomid;
      this.manager.roomtype = 1;
      this.manager.gametype = 2;
      this.manager.locked = data.locked;
      this.manager.playerHost = false;
      this.manager.players = [];
      for (let p of data.players) {
        let pl = new Player(p.username, 1, p.color, p.host, p.userid, p.roomid, true, true);
        this.manager.players.push(pl);
      }
      // console.log(data);
      this.router.navigateByUrl("waiting");
    });

    socket.on("JOIN_FAILED", () => {
      this._snackbar.open("Room doesn't Exist or is Full!", "OK", {
        duration: 2000
      });
    });

  }

  ngOnDestroy() {
    socket.off("OPEN_ROOMS");
    socket.off("ROOM_LOCKED");
    socket.off("ROOM_UNLOCKED");
    socket.off("INVITATION");
    socket.off("NEW_ROOM");
    socket.off("JOIN_SUCCESS");
    socket.off("JOIN_FAILED");
  }

}
