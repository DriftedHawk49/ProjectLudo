import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Rooms } from 'src/app/classes/rooms';
import socket from 'src/app/socket';

@Component({
  selector: 'app-find-rooms',
  templateUrl: './find-rooms.component.html',
  styleUrls: ['./find-rooms.component.scss']
})
export class FindRoomsComponent implements OnInit, OnDestroy {

  backupOpenRooms: any;
  openRooms: any;
  noOfRooms: number;
  Object = Object;

  constructor(private dialogRef: MatDialogRef<FindRoomsComponent>) {
    this.openRooms = {};
    this.backupOpenRooms = {};
    this.noOfRooms = 0;
  }


  searchByRoomName(arg: any) {
    let testString = arg.value;
    if (testString == "") {
      this.openRooms = this.backupOpenRooms;
    } else {
      let temp = this.backupOpenRooms;
      for (let roomid in temp) {
        if (temp[roomid].roomname.match(new RegExp(testString, "g")) == null) {
          delete this.openRooms[roomid];
        }
      }
    }
  }

  joinRoom(roomid: string) {
    socket.emit("JOIN_ROOM", { roomid: roomid });
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    socket.emit("SEND_OPEN_ROOMS");

    // Enter all the socket events here
    socket.on("OPEN_ROOMS", (data) => {
      this.openRooms = {};
      this.backupOpenRooms = {};
      this.noOfRooms = data.length;
      for (let room of data) {
        this.openRooms[room.roomid] = (new Rooms(room.roomname, room.roomid, room.noOfPlayers));
        this.backupOpenRooms[room.roomid] = (new Rooms(room.roomname, room.roomid, room.noOfPlayers));
      }
    });
    socket.on("ROOM_LOCKED", (roomid) => {
      if (this.openRooms[roomid] != undefined) {
        delete this.openRooms[roomid];
        delete this.backupOpenRooms[roomid];
        this.noOfRooms = Object.keys(this.backupOpenRooms).length;
      }
    });
    socket.on("ROOM_UNLOCKED", (data) => {
      this.openRooms[data.roomid] = new Rooms(data.roomname, data.roomid, data.noOfPlayers);
      this.backupOpenRooms[data.roomid] = new Rooms(data.roomname, data.roomid, data.noOfPlayers);
      this.noOfRooms = Object.keys(this.backupOpenRooms).length;
    });
  }

  ngOnDestroy(): void {
    socket.off("OPEN_ROOMS");
    socket.off("ROOM_LOCKED");
    socket.off("ROOM_UNLOCKED");
  }


}
