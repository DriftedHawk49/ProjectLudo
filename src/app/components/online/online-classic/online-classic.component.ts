import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Player } from 'src/app/classes/player';
import { Position } from 'src/app/classes/position';
import { COLOR } from 'src/app/enum/color.enum';
import { ROOMTYPE } from 'src/app/enum/roomtype.enum';
import { TILETYPE } from 'src/app/enum/tiletype.enum';
import { GameService } from 'src/app/services/gameService/game.service';
import { InviteService } from 'src/app/services/inviteService/invite.service';
import { OnlineManagerService } from 'src/app/services/onlineManagerService/online-manager.service';
import { UserManagerService } from 'src/app/services/userManagerService/user-manager.service';
import socket from 'src/app/socket';
import { MultiTokenSelectorComponent } from '../../modals/multi-token-selector/multi-token-selector.component';

@Component({
  selector: 'app-online-classic',
  templateUrl: './../../templates/board.html',
  styleUrls: ['./../../templates/classic-board/cboard.scss', './../../templates/commonStyles.scss']
})
export class OnlineClassicComponent implements OnInit, OnDestroy {

  currentPlayer: any | Player;
  diceRollSound: any;
  dualSound: any;
  normalSound: any;
  eliminateSound: any;
  homeSound: any;
  playerLeftSound: any;
  turnChangeSound: any;

  constructor(private _snackbar: MatSnackBar, private manager: OnlineManagerService, private inviteManager: InviteService, public controller: GameService, private user: UserManagerService, private dialog: MatDialog, private router: Router) {
    for (let p of controller.players) {
      if (p.userid == user.userid) {
        this.currentPlayer = p;
      }
    }
  }

  diceClick(arg: any) {
    if (arg && this.controller.turn == this.currentPlayer.color) {
      let diceNumber = this.controller.throwDice();
      socket.emit("DICE_THROW", diceNumber);
    }
  }

  tileClick(i: number, j: number) {
    console.log(i, j);

    if (this.controller.turn == this.currentPlayer.color && this.controller.gameboard[i][j].eligible) {
      socket.emit("TILE_CLICK", new Position(i, j));
    }
  }

  testFunction() {

  }

  ngOnInit(): void {
    this.diceRollSound = document.getElementById("dicerollsound");
    this.dualSound = document.getElementById("dualsound");
    this.normalSound = document.getElementById("normalsound");
    this.eliminateSound = document.getElementById("eliminatesound");
    this.homeSound = document.getElementById("homesound");
    this.playerLeftSound = document.getElementById("playerleftsound");
    this.turnChangeSound = document.getElementById("turnchangesound");


    console.log("I AM BORN");
    this.controller.turnMiss.subscribe((arg: boolean) => {
      if (this.controller.turn == this.currentPlayer.color && arg) {
        socket.emit("CHANGE_TURN", this.controller.turn);
      }
    });

    socket.on("TURN_CHANGED", (newTurn) => {
      this.turnChangeSound.play();
      this.controller.disableAllEligible();
      this.controller.stopCommander.next(true);
      this.controller.turn = newTurn;
      this.controller.ticker = 0;
      this.controller.dice = -1;
      this.controller.diceURLSet();
      this.controller.initiateTimer(30);
    });

    socket.on("TURN_RETAINED", () => {
      this.turnChangeSound.play();
      this.controller.retainTurn();
    });

    socket.on("TIMER_STOPPED", () => {
      this.controller.stopCommander.next(true);
    })

    socket.on("DICE_THROWN", (diceNumber) => {
      this.diceRollSound.play();
      this.controller.stopCommander.next(true);
      this.controller.dice = diceNumber;
      this.controller.diceURLSet();

      if (this.controller.highlightEligibleTiles()) {
        this.controller.initiateTimer(45);
      } else {
        this.controller.stopCommander.next(true);
        if (this.currentPlayer.color == this.controller.turn) {
          setTimeout(() => {
            socket.emit("CHANGE_TURN", this.controller.turn);
          }, 2000);
        }


      }
    });

    socket.on("MULTI_TOKEN_MOVED", (payload) => {
      let np = this.controller.findNewPositionClassic(payload.position);
      let response = this.controller.placeOnNewPosition(payload.token.id, np);

      if (response.clash) {
        this.eliminateSound.play();
        // Enter code to give a sound que for the same
      } else if (response.newDual) {
        this.dualSound.play();
        // Enter code to give a sound que for the same
      } else if (response.dualMovement) {
        this.normalSound.play();
        // Enter code to give a sound que for the same
      }else{
        this.normalSound.play();
      }

      if (this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE) {
        // Enter code to give sound que for the same
        this.homeSound.play();
        this.controller.updateRank();
        if (this.controller.turn == this.currentPlayer.color) {
          let payload = [];
          for (let p of this.controller.players) {
            payload.push({
              userid: p.userid,
              rank: p.rank
            });

          }
          socket.emit("UPDATE_RANK", payload);
        }
      }

      if ((this.controller.dice == 6 || response.clash || this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE || (this.controller.dice == 3 && response.dualMovement)) && !this.controller.isGameOver()) {
        // Write code to give sound que for repeat turn.
        if (this.controller.turn == this.currentPlayer.color) {
          socket.emit("RETAIN_TURN");
        }
      } else {
        this.controller.stopCommander.next(true);
        if (this.controller.turn == this.currentPlayer.color) {
          socket.emit("CHANGE_TURN", this.controller.turn);
        }
      }

    });

    socket.on("TILE_CLICKED", (posi: Position) => {
      let response: any = {
        clash: false,
        newDual: false,
        dualMovement: false
      };
      let np: Position = new Position(0, 0);

      if (this.controller.gameboard[posi.x][posi.y].eligible) {
        this.controller.disableAllEligible();
        let toke = this.controller.gameboard[posi.x][posi.y].getAllTokenInfo(this.controller.turn);

        if (toke.length == 1) {

          if (this.controller.isItLocked(posi.x, posi.y)) {
            this.normalSound.play();
            this.controller.unlockToken(posi);
          } else {
            np = this.controller.findNewPositionClassic(posi);
            response = this.controller.placeOnNewPosition(toke[0].id, np);
            if (response.clash) {
              this.eliminateSound.play();
              // Enter code to give a sound que for the same
            } else if (response.newDual) {
              this.dualSound.play();
              // Enter code to give a sound que for the same
            } else if (response.dualMovement) {
              this.normalSound.play();
              // Enter code to give a sound que for the same
            }else{
              this.normalSound.play();
            }

            if (this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE) {
              // Enter code to give sound que for the same
              this.homeSound.play();

              this.controller.updateRank();
              if (this.controller.turn == this.currentPlayer.color) {
                let payload = [];
                for (let p of this.controller.players) {
                  payload.push({
                    userid: p.userid,
                    rank: p.rank
                  });
                }
                socket.emit("UPDATE_RANK", payload);
              }
            }
          }

          if ((this.controller.dice == 6 || response.clash || this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE) && !this.controller.isGameOver()) {
            if (this.controller.turn == this.currentPlayer.color) {
              socket.emit("RETAIN_TURN");
            }
          } else {
            this.controller.stopCommander.next(true);
            if (this.controller.turn == this.currentPlayer.color) {
              socket.emit("CHANGE_TURN", this.controller.turn);
            }
          }
        } else {
          let res = this.controller.tokenPresenceCheck(toke);
          if (res.single && res.dual) {

            if (this.controller.turn == this.currentPlayer.color) {
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
                socket.emit("STOP_TIMER");
              });

              dl.afterClosed().subscribe((val: number) => {
                if (val == 2) {
                  this.controller.dice = Math.floor(this.controller.dice / 2);
                  let temp = [...toke];
                  for (let t of temp) {
                    if (t.dual) {
                      toke = [];
                      toke.push(t);
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

                socket.emit("MULTI_TOKEN_MOVEMENT", {
                  position: posi,
                  token: toke[0],
                });
              });
            }

          } else if (res.dual) {
            this.controller.dice = Math.floor(this.controller.dice / 2);
          }

          if (!(res.single && res.dual)) {
            np = this.controller.findNewPositionClassic(posi);
            response = this.controller.placeOnNewPosition(toke[0].id, np);
            if (response.clash) {
              this.eliminateSound.play();
              // Enter code to give a sound que for the same
            } else if (response.newDual) {
              this.dualSound.play();
              // Enter code to give a sound que for the same
            } else if (response.dualMovement) {
              this.normalSound.play();
              // Enter code to give a sound que for the same
            }else{
              this.normalSound.play();

            }

            if (this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE) {
              // Enter code to give sound que for the same
              this.homeSound.play();

              this.controller.updateRank();
              if (this.controller.turn == this.currentPlayer.color) {
                let payload = [];
                for (let p of this.controller.players) {
                  payload.push({
                    userid: p.userid,
                    rank: p.rank
                  });
                }
                socket.emit("UPDATE_RANK", payload);
              }
            }

            if ((this.controller.dice == 6 || response.clash || this.controller.gameboard[np.x][np.y].type == TILETYPE.HOMETILE || (this.controller.dice == 3 && response.dualMovement)) && !this.controller.isGameOver()) {
              // Write code to give sound que for repeat turn.
              if (this.controller.turn == this.currentPlayer.color) {
                socket.emit("RETAIN_TURN");
              }
            } else {
              this.controller.stopCommander.next(true);
              if (this.controller.turn == this.currentPlayer.color) {
                socket.emit("CHANGE_TURN", this.controller.turn);
              }
            }
          }
        }
      }
    });

    socket.on("GAME_OVER", () => {
      let maxRank = -1;
      this.controller.roomtype = ROOMTYPE.END;

      for (let p of this.controller.players) {
        if (maxRank < p.rank) {
          maxRank = p.rank;
        }
      }

      for (let i = 0; i < this.controller.players.length; i++) {
        if (this.controller.players[i].online && this.controller.players[i].rank == -1) {
          this.controller.players[i].rank = maxRank + 1;
        }
      }

      this.router.navigateByUrl("onlinegameover");
    });

    socket.on("INGAME_PLAYER_LEFT", (puserid) => {
      this.playerLeftSound.play();
      for (let i = 0; i < this.controller.players.length; i++) {
        if (this.controller.players[i].userid == puserid) {
          this.controller.players[i].online = false;
          this._snackbar.open(`${this.controller.players[i].username} left.`, "OK", {
            duration: 2000
          });
          this.controller.resetTokens(this.controller.players[i].color);
          if (this.currentPlayer.host && this.controller.turn == this.controller.players[i].color) {
            console.log("Changing Turn");
            socket.emit("CHANGE_TURN", this.controller.turn);
          }
          break;
        }
      }
      console.log("PLAYER LEFT");

    });

    socket.on("HOST_CHANGED", (data) => {
      this.playerLeftSound.play();
      console.log("HOST CHANGED");

      if (this.currentPlayer.userid == data.newHost) {
        this.currentPlayer.host = true;
      }

      for (let i = 0; i < this.controller.players.length; i++) {
        if (this.controller.players[i].host) {
          this.controller.players[i].host = false;
        }
        if (this.controller.players[i].userid == data.disconnected) {
          this.controller.players[i].online = false;
          this.controller.players[i].host = false;
          this._snackbar.open("Player Left. Host is changed.", "OK", {
            duration: 2000
          });
          this.controller.resetTokens(this.controller.players[i].color);
          if (this.currentPlayer.host && this.controller.turn == this.controller.players[i].color) {
            console.log("Changing Turn");
            socket.emit("CHANGE_TURN", this.controller.turn);
          }
        }
        if (this.controller.players[i].userid == data.newHost) {
          this.controller.players[i].host = true;
        }
      }

    });

    socket.on("EVERYONE_LEFT", () => {
      this._snackbar.open("Everyone Left the Room.", "OK", {
        duration: 2500
      });
      this.controller.resetParameters();
      this.inviteManager.reset();
      this.manager.resetManager();
      this.router.navigateByUrl("onlinegame");
    });

    socket.on("MUTE_CHANGED", (data) => {
      for (let i = 0; i < this.controller.players.length; i++) {
        if (this.controller.players[i].userid == data.userid) {
          this.controller.players[i].mute = data.status;
        }
      }
    });
  }

  ngOnDestroy(): void {
    console.log("DESTRUCTION");
    this.controller.stopCommander.next(true);
    socket.off("DICE_THROWN");
    socket.off("TURN_CHANGED");
    socket.off("GAME_OVER");
    socket.off("TILE_CLICKED");
    socket.off("TURN_RETAINED");
    socket.off("MULTI_TOKEN_MOVED");
    socket.off("TIMER_STOPPED");
    socket.off("INGAME_PLAYER_LEFT");
    socket.off("HOST_CHANGED");
    socket.off("EVERYONE_LEFT");
    socket.off("MUTE_CHANGED");
  }


}
