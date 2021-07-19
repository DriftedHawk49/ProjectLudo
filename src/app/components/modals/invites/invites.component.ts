import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InviteService } from 'src/app/services/inviteService/invite.service';
import socket from 'src/app/socket';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<InvitesComponent>, public invitations: InviteService, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    
  }

  acceptRequest(roomid: string, i:number){
    this._snackbar.dismiss();
    socket.emit("JOIN_ROOM", {roomid: roomid});
    this.invitations.invitations.splice(i,1);
    this.closeDialog();

  }

  rejectRequest(i: number){
    this._snackbar.dismiss();
    this.invitations.invitations.splice(i,1);
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
