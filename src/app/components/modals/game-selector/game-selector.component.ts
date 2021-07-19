import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-selector',
  templateUrl: './game-selector.component.html',
  styleUrls: ['./game-selector.component.scss']
})
export class GameSelectorComponent implements OnInit {


  constructor(private dialogRef: MatDialogRef<GameSelectorComponent>, private router: Router) {
   
  }



  startOffline(){
    this.dialogRef.close({offlineMode: true});
  }

  startOnline(){
    this.dialogRef.close({offlineMode: false});
    this.router.navigateByUrl("onlinegame");

  }  



  ngOnInit(): void {
  }

}
