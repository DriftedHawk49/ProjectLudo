import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Position } from 'src/app/classes/position';
import { COLOR } from 'src/app/enum/color.enum';
import { GAMETYPE } from 'src/app/enum/gametype.enum';
import { ROOMTYPE } from 'src/app/enum/roomtype.enum';
import { TILETYPE } from 'src/app/enum/tiletype.enum';
import { GameService } from 'src/app/services/gameService/game.service';
import { MultiTokenSelectorComponent } from '../../modals/multi-token-selector/multi-token-selector.component';



@Component({
  selector: 'app-offline-classic',
  templateUrl: './../../templates/board.html',
  styleUrls: ['./../../templates/classic-board/cboard.scss', './../../templates/commonStyles.scss']
})
export class OfflineClassicComponent implements OnInit {

  diceRollSound: any;
  dualSound: any;
  normalSound: any;
  eliminateSound: any;
  homeSound: any;
  playerLeftSound: any;
  turnChangeSound: any;

  constructor(public controller: GameService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {

    this.diceRollSound = document.getElementById("dicerollsound");
    this.dualSound = document.getElementById("dualsound");
    this.normalSound = document.getElementById("normalsound");
    this.eliminateSound = document.getElementById("eliminatesound");
    this.homeSound = document.getElementById("homesound");
    this.playerLeftSound = document.getElementById("playerleftsound");
    this.turnChangeSound = document.getElementById("turnchangesound");

    this.controller.turnMiss.subscribe((arg: boolean) => {
      if (arg) {
        this.turnChangeSound.play();
        this.controller.disableAllEligible();
        this.controller.stopCommander.next(true);
        let nextTurn = this.controller.changeTurn();
        if (nextTurn.status == "GAMEOVER") {
          this.controller.assignRank(nextTurn.last);
          // ENTER CODE FOR ENDING GAME AND ROUTE TO ENDGAME PAGE.
          console.log("GAMEOVER");
          for (let i = 0; i < this.controller.players.length; i++) {
            this.controller.players[i].roomtype = ROOMTYPE.END;
          }
          this.router.navigateByUrl("offlinegameover");
          return;

        } else {

        }
        this.controller.diceURLSet();
        this.controller.initiateTimer(30);
      }
    });

  }

  diceClick(arg: any) {

    this.diceRollSound.play();
    this.controller.stopCommander.next(true);
    this.controller.dice = this.controller.throwDice();
    this.controller.diceURLSet();

    if (this.controller.highlightEligibleTiles()) {
      this.controller.initiateTimer(45);
    } else {

      this.controller.stopCommander.next(true);
      setTimeout(() => {
        this.turnChangeSound.play();
        let nextTurn = this.controller.changeTurn();
        if (nextTurn.status == "GAMEOVER") {
          this.controller.assignRank(nextTurn.last);
          // ENTER CODE FOR ENDING GAME AND ROUTE TO ENDGAME PAGE.
          console.log("GAMEOVER");
          for (let i = 0; i < this.controller.players.length; i++) {
            this.controller.players[i].roomtype = ROOMTYPE.END;
          }
          this.router.navigateByUrl("offlinegameover");
          return;

        }
        this.controller.diceURLSet();
        this.controller.initiateTimer(30);
      }, 1500);
    }

  }

  tileClick(i: number, j: number) {
    let response: any = {
      clash: false,
      newDual: false,
      dualMovement: false
    };
    let np: Position = new Position(0, 0);
    let isDualPrivate: boolean = false;
    if (this.controller.gameboard[i][j].eligible) {
      this.controller.disableAllEligible();
      let toke = this.controller.gameboard[i][j].getAllTokenInfo(this.controller.turn);

      if (toke.length == 1) {

        if (this.controller.isItLocked(i, j)) {
          this.controller.unlockToken(new Position(i, j));

        } else {

          np = this.controller.findNewPositionClassic(new Position(i, j));
          response = this.controller.placeOnNewPosition(toke[0].id, np);
          console.log(response);
          if (response.clash) {
            this.eliminateSound.play();

            // Enter code to give a sound que for the same
          } else if (response.newDual) {
            this.dualSound.play();

            // Enter code to give a sound que for the same
          } else if (response.dualMovement) {
            this.normalSound.play();

            // Enter code to give a sound que for the same
          } else {
            this.normalSound.play();

          }

          if (this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE) {
            // Enter code to give sound que for the same
            this.homeSound.play();

            this.controller.updateRank();
          }
        }

        if ((this.controller.dice == 6 || response.clash || this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE) && !this.controller.isGameOver()) {
          // Write code to give sound que for repeat turn.
          this.turnChangeSound.play();

          this.controller.retainTurn();
        } else {
          this.turnChangeSound.play();

          this.controller.stopCommander.next(true);
          let nextTurn = this.controller.changeTurn();
          if (nextTurn.status == "GAMEOVER") {
            this.controller.assignRank(nextTurn.last);
            // ENTER CODE FOR ENDING GAME AND ROUTE TO ENDGAME PAGE.
            console.log("GAMEOVER");
            for (let i = 0; i < this.controller.players.length; i++) {
              this.controller.players[i].roomtype = ROOMTYPE.END;
            }
            this.router.navigateByUrl("offlinegameover");
            return;
          }
          this.controller.diceURLSet();
          this.controller.initiateTimer(30);

        }

      } else {
        let res = this.controller.tokenPresenceCheck(toke);
        if (res.single && res.dual) {
          /* 
            Condition where both tokens are present. In this case, ask user to select the type of token to select
            Via a dialog box.
          */

          let sign: string = "";

          if (this.controller.turn == COLOR.YELLOW) {
            sign = "Y";
          } else if (this.controller.turn == COLOR.RED) {
            sign = "R";
          } else if (this.controller.turn == COLOR.GREEN) {
            sign = "G";
          } else if (this.controller.turn == COLOR.BLUE) {
            sign = "B";
          }

          let dl = this.dialog.open(MultiTokenSelectorComponent, {
            width: "150px",
            height: "130px",
            panelClass: "modalClass",
            closeOnNavigation: true,
            disableClose: true,
            data: {
              color: this.controller.turn,
              signature: sign
            }
          });

          dl.afterOpened().subscribe((val: any) => {
            this.controller.stopCommander.next(true);
          })

          dl.afterClosed().subscribe((val: number) => {
            if (val == 2) {
              this.controller.dice = Math.floor(this.controller.dice / 2);
              let temp = [...toke];
              for (let t of temp) {
                if (t.dual) {
                  toke = [];
                  toke.push(t);
                  isDualPrivate = true;
                  break;
                }
              }
            } else {
              let temp = [...toke];
              for (let t of temp) {
                if (!t.dual) {
                  toke = [];
                  toke.push(t);
                  break;
                }
              }
            }

            np = this.controller.findNewPositionClassic(new Position(i, j));
            response = this.controller.placeOnNewPosition(toke[0].id, np);
            console.log(response);
            if (response.clash) {
              this.eliminateSound.play();

              // Enter code to give a sound que for the same
            } else if (response.newDual) {
              this.dualSound.play();

              // Enter code to give a sound que for the same
            } else if (response.dualMovement) {
              this.normalSound.play();

              // Enter code to give a sound que for the same
            } else {
              this.normalSound.play();

            }

            if (this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE) {
              // Enter code to give sound que for the same
              this.homeSound.play();

              this.controller.updateRank();
            }
            if ((this.controller.dice == 6 || response.clash || this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE || (isDualPrivate && this.controller.dice == 3)) && !this.controller.isGameOver()) {
              // Write code to give sound que for repeat turn.
              this.turnChangeSound.play();
              this.controller.retainTurn();
            } else {
              this.turnChangeSound.play();

              this.controller.stopCommander.next(true);
              let nextTurn = this.controller.changeTurn();
              if (nextTurn.status == "GAMEOVER") {
                this.controller.assignRank(nextTurn.last);
                // ENTER CODE FOR ENDING GAME AND ROUTE TO ENDGAME PAGE.
                console.log("GAMEOVER");
                for (let i = 0; i < this.controller.players.length; i++) {
                  this.controller.players[i].roomtype = ROOMTYPE.END;
                }
                this.router.navigateByUrl("offlinegameover");
                return;
              }
              this.controller.diceURLSet();
              this.controller.initiateTimer(30);
            }

          });

        } else if (res.dual) {
          this.controller.dice = Math.floor(this.controller.dice / 2);
          isDualPrivate = true;
        }

        if (!(res.single && res.dual)) {
          np = this.controller.findNewPositionClassic(new Position(i, j));
          response = this.controller.placeOnNewPosition(toke[0].id, np);
          console.log(response);
          if (response.clash) {
            this.eliminateSound.play();

            // Enter code to give a sound que for the same
          } else if (response.newDual) {
            this.dualSound.play();

            // Enter code to give a sound que for the same
          } else if (response.dualMovement) {
            this.normalSound.play();

            // Enter code to give a sound que for the same
          } else {
            this.normalSound.play();

          }

          if (this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE) {
            // Enter code to give sound que for the same
            this.homeSound.play();
            this.controller.updateRank();
          }
          if ((this.controller.dice == 6 || response.clash || this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE || (isDualPrivate && this.controller.dice == 3)) && !this.controller.isGameOver()) {
            // Write code to give sound que for repeat turn.
            this.turnChangeSound.play();

            this.controller.retainTurn();
          } else {
            this.turnChangeSound.play();

            this.controller.stopCommander.next(true);
            let nextTurn = this.controller.changeTurn();
            if (nextTurn.status == "GAMEOVER") {
              this.controller.assignRank(nextTurn.last);
              // ENTER CODE FOR ENDING GAME AND ROUTE TO ENDGAME PAGE.
              console.log("GAMEOVER");
              for (let i = 0; i < this.controller.players.length; i++) {
                this.controller.players[i].roomtype = ROOMTYPE.END;
              }
              this.router.navigateByUrl("offlinegameover");
              return;

            }
            this.controller.diceURLSet();
            this.controller.initiateTimer(30);
          }
        }
      }

    }

  }

  testFunction() {
    // this.controller.test();
  }

}
