import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Player } from 'src/app/classes/player';
import { COLOR } from 'src/app/enum/color.enum';
import { GAMETYPE } from 'src/app/enum/gametype.enum';
import { ROOMTYPE } from 'src/app/enum/roomtype.enum';
import { GameService } from 'src/app/services/gameService/game.service';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';


@Component({
  selector: 'app-offline-game-set',
  templateUrl: './offline-game-set.component.html',
  styleUrls: ['./offline-game-set.component.scss']
})
export class OfflineGameSetComponent implements OnInit {

  createOfflineRoomForm: FormGroup;
  gameType: GAMETYPE;
  noOfPlayers: number;
  yellowPlayerName: null | string;
  redPlayerName: null | string;
  bluePlayerName: null | string;
  greenPlayerName: null | string;

  constructor(public currentUser: UserManagerService, private _snackbar: MatSnackBar, private controller: GameService,
    private router: Router, private dialog: MatDialogRef<OfflineGameSetComponent>) {

    this.createOfflineRoomForm = new FormGroup({
      roomname: new FormControl("", [Validators.required, Validators.maxLength(15)]),
    });
    this.gameType = GAMETYPE.CLASSIC;
    this.noOfPlayers = 4;
    this.yellowPlayerName = currentUser.username;
    this.redPlayerName = "";
    this.bluePlayerName = "";
    this.greenPlayerName = "";
  }

  ngOnInit(): void {
    this.controller.resetParameters();
  }

  get roomname() {
    return this.createOfflineRoomForm.get("roomname");
  }

  setNumberOfPlayers(arg: number) {
    this.noOfPlayers = arg;
  }

  selectGame(arg: GAMETYPE) {
    this.gameType = arg;
  }

  createOfflineSession() {
    let move = true;

    if (this.createOfflineRoomForm.invalid) {
      move = false;
      this._snackbar.open("Please Enter Room Name", "OK", {
        verticalPosition: 'top',
        panelClass: "snackbar",
        duration: 3000
      });
    } else if (this.noOfPlayers == 4) {
      if (this.yellowPlayerName == "" || this.redPlayerName == "" || this.bluePlayerName == "" || this.greenPlayerName == "") {
        move = false;
        this._snackbar.open("Please Enter Player Names", "OK", {
          verticalPosition: 'top',
          panelClass: "snackbar",
          duration: 3000
        });
      }
    } else if (this.noOfPlayers == 3) {
      if (this.yellowPlayerName == "" || this.redPlayerName == "" || this.greenPlayerName == "") {
        move = false;
        this._snackbar.open("Please Enter Player Names", "OK", {
          verticalPosition: 'top',
          panelClass: "snackbar",
          duration: 3000
        });
      }
    } else if (this.noOfPlayers == 2) {
      if (this.yellowPlayerName == "" || this.redPlayerName == "") {
        move = false;
        this._snackbar.open("Please Enter Player Names", "OK", {
          verticalPosition: 'top',
          panelClass: "snackbar",
          duration: 3000
        });
      }
    }


    if (move) {
      let players: Player[] = [];

      if (this.noOfPlayers == 4) {
        let yp = new Player(String(this.yellowPlayerName), ROOMTYPE.GAME, COLOR.YELLOW, true);
        let rp = new Player(String(this.redPlayerName), ROOMTYPE.GAME, COLOR.RED, false);
        let gp = new Player(String(this.greenPlayerName), ROOMTYPE.GAME, COLOR.GREEN, false);
        let bp = new Player(String(this.bluePlayerName), ROOMTYPE.GAME, COLOR.BLUE, false);
        players.push(yp, rp, gp, bp);
      } else if (this.noOfPlayers == 3) {
        let yp = new Player(String(this.yellowPlayerName), ROOMTYPE.GAME, COLOR.YELLOW, true);
        let rp = new Player(String(this.redPlayerName), ROOMTYPE.GAME, COLOR.RED, false);
        let gp = new Player(String(this.greenPlayerName), ROOMTYPE.GAME, COLOR.GREEN, false);
        players.push(yp, rp, gp);
      } else if (this.noOfPlayers == 2) {
        let yp = new Player(String(this.yellowPlayerName), ROOMTYPE.GAME, COLOR.YELLOW, true);
        let rp = new Player(String(this.redPlayerName), ROOMTYPE.GAME, COLOR.RED, false);
        players.push(yp, rp);
      }

      /* Set all the parameters and start game */
      if (this.gameType == GAMETYPE.CLASSIC) {
        this.controller.createClassicGame(players, true, this.roomname?.value);
        // console.log(players);
        // Route to relevant route. Implement Authguards later.

        this.router.navigateByUrl("offlineclassic");
        this.dialog.close();
      } else {
        this.controller.createMiniGame(players, true, this.roomname?.value);
        // Route to relevant route. Implement Authguards later.
        this.router.navigateByUrl("offlinemini");
        this.dialog.close();
      }

    }
  }




}


/*

{
      verticalPosition: 'top',
      panelClass: "snackbar",
    }
*/