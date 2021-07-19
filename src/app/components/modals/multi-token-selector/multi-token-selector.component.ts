import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-multi-token-selector',
  templateUrl: './multi-token-selector.component.html',
  styleUrls: ['./multi-token-selector.component.scss']
})
export class MultiTokenSelectorComponent implements OnInit {

  data: any;
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private dialog: MatDialogRef<MultiTokenSelectorComponent>) {
    this.data = data;
  }

  // Do all the necessary work of sending the type of token selected to 
  // Move or make changes
  closeTheInstance(selection: number) {
    console.log(selection);
    this.dialog.close(selection);
  }

  ngOnInit(): void {

  }

}
