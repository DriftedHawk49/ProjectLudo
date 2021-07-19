import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {

  testTimer: number;
  stopCommand: Subject<boolean>;
  testString: string;

  constructor(private _snackbar: MatSnackBar) {
    this.testTimer = 0;
    this.stopCommand = new Subject<boolean>();
    this.testString = "";
  }


  ngOnInit(): void {
  interval(1000).pipe(takeUntil(this.stopCommand)).subscribe((val: number)=>{
    if(val==30){
      this.stopCommand.next(true);
      this.testString = "TIMER STOPPED";
    }
    this.testTimer = val;
  })
  
  }

  snacky(){
    this._snackbar.open("Hello","OK",{
      verticalPosition: 'top',
      panelClass: "snackbar",
    });
  }

}
