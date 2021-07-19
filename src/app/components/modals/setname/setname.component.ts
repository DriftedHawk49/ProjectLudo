import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-setname',
  templateUrl: './setname.component.html',
  styleUrls: ['./setname.component.scss']
})
export class SetnameComponent implements OnInit {

  nameForm: FormGroup;

  constructor(public userManager: UserManagerService,
    private dialogRef: MatDialogRef<SetnameComponent>,
    private _snackbar: MatSnackBar,
    ) {
    this.nameForm = new FormGroup({
      username: new FormControl("", [Validators.required, Validators.maxLength(15), Validators.minLength(3)])
    });


  }

  get username() {
    return this.nameForm.get("username");
  }

  setUsername() {
    if (!this.username?.invalid) {
      /* 
      Set username and user id , later send it to server for online games. 
      Use this UUID in peerJS also. 
      */
      this.userManager.setUserName(this.username?.value);
      this.userManager.setUserID(uuidv4());
      this._snackbar.open("Name Saved!", "OK", {
        duration: 3000
      });
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {


  }

}
