import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';
import { GameSelectorComponent } from '../modals/game-selector/game-selector.component';
import { OfflineGameSetComponent } from '../modals/offline-game-set/offline-game-set.component';
import { SetnameComponent } from '../modals/setname/setname.component';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public userManager: UserManagerService, private _dialog: MatDialog) { }

  ngOnInit(): void {

  }

  getStarted() {
    if (this.userManager.username == undefined && this.userManager.userid==undefined) {
      let nameSettingDialog = this._dialog.open(SetnameComponent, {
        closeOnNavigation: true,
        width: "350px",
        height: "240px",
        panelClass: "modalClass",
        disableClose: true
      });

      nameSettingDialog.afterClosed().subscribe(() => {
        let gameSelectorDialog = this._dialog.open(GameSelectorComponent, {
          closeOnNavigation: true,
          panelClass: "modalClass",
          disableClose: true,
          width: "350px",
          autoFocus: false
        });

        gameSelectorDialog.afterClosed().subscribe((arg: any)=>{
          if(arg.offlineMode){
            this._dialog.open(OfflineGameSetComponent,{
              width: "350px",
              panelClass: "modalClass",
              autoFocus: false,
              closeOnNavigation: true
            });
          }
        })
      });
    } else {
      let gameSelectorDialog = this._dialog.open(GameSelectorComponent, {
        closeOnNavigation: true,
        panelClass: "modalClass",
        disableClose: true,
        width: "350px",
        autoFocus: false
      });

      gameSelectorDialog.afterClosed().subscribe((arg: any)=>{
        if(arg.offlineMode){
          this._dialog.open(OfflineGameSetComponent,{
            width: "350px",
            panelClass: "modalClass",
            autoFocus: false,
            closeOnNavigation: true
          });
        }
      })
    }
  }

}
