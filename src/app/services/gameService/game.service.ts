import { Injectable } from '@angular/core';
import { Observable, interval, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Player } from 'src/app/classes/player';
import { Position } from 'src/app/classes/position';
import { Tile } from 'src/app/classes/tile';
import { Token } from 'src/app/classes/token';
import { COLOR } from 'src/app/enum/color.enum';
import { GAMETYPE } from 'src/app/enum/gametype.enum';
import { ROOMTYPE } from 'src/app/enum/roomtype.enum';
import { TILETYPE } from 'src/app/enum/tiletype.enum';

// unlock not included.
const maxSteps = {
  1: 38,
  2: 56
}

const diceURLlist: any = {
  1: [
    'assets/yellow-dice/one.svg',
    'assets/yellow-dice/default.svg',
    'assets/yellow-dice/two.svg',
    'assets/yellow-dice/three.svg',
    'assets/yellow-dice/four.svg',
    'assets/yellow-dice/five.svg',
    'assets/yellow-dice/six.svg'
  ],
  2: [
    'assets/red-dice/default.svg',
    'assets/red-dice/one.svg',
    'assets/red-dice/two.svg',
    'assets/red-dice/three.svg',
    'assets/red-dice/four.svg',
    'assets/red-dice/five.svg',
    'assets/red-dice/six.svg'
  ],
  3: [
    'assets/green-dice/default.svg',
    'assets/green-dice/one.svg',
    'assets/green-dice/two.svg',
    'assets/green-dice/three.svg',
    'assets/green-dice/four.svg',
    'assets/green-dice/five.svg',
    'assets/green-dice/six.svg'
  ],
  4: [
    'assets/blue-dice/default.svg',
    'assets/blue-dice/one.svg',
    'assets/blue-dice/two.svg',
    'assets/blue-dice/three.svg',
    'assets/blue-dice/four.svg',
    'assets/blue-dice/five.svg',
    'assets/blue-dice/six.svg'
  ]
};

@Injectable({
  providedIn: 'root'
})
export class GameService {

  diceURL: string;
  roomname: string;
  roomtype: ROOMTYPE;
  roomid: string;
  gameboard: (Tile[])[];
  offline: boolean;
  turn: COLOR;
  players: Player[];
  gametype: GAMETYPE;
  noOfPlayers: number;
  tokenPositions: any;
  dice: number;
  ticker: number;
  maxTime: number;
  turnMiss: Subject<boolean>;
  stopCommander: Subject<boolean>;

  /*   test(){
      let ts = [
        new Token("B1", COLOR.BLUE, GAMETYPE.CLASSIC, new Position(11, 2)),
        new Token("B1", COLOR.BLUE, GAMETYPE.CLASSIC, new Position(11, 2)),
        new Token("B1", COLOR.BLUE, GAMETYPE.CLASSIC, new Position(11, 2)),
        new Token("Y1", COLOR.YELLOW, GAMETYPE.CLASSIC, new Position(2, 2)),
        new Token("Y1", COLOR.YELLOW, GAMETYPE.CLASSIC, new Position(2, 2)),
        new Token("R1", COLOR.RED, GAMETYPE.CLASSIC, new Position(2, 11)),
        new Token("G1", COLOR.GREEN, GAMETYPE.CLASSIC, new Position(11, 11)),
        new Token("G1", COLOR.GREEN, GAMETYPE.CLASSIC, new Position(11, 11)),
        new Token("G1", COLOR.GREEN, GAMETYPE.CLASSIC, new Position(11, 11)),
        new Token("G1", COLOR.GREEN, GAMETYPE.CLASSIC, new Position(11, 11))
      ];
  
      for(let t of ts){
        this.gameboard[0][6].addToken(t);
      }
    } */


  /**
 * classicBoardBuilder : An object containing different row builder functions for classic board
 * which returns the row, which can be appended back to the main board game array.
 */
  private classicBoardBuilder: any = {
    row1: () => {
      let row: Tile[] = [];

      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.YELLOW);
        row.push(t);
      }
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEENTRY, COLOR.RED));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.RED);
        row.push(t);
      }

      return row;
    },
    row2: () => {
      let row: Tile[] = [];
      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.YELLOW);
        row.push(t);
      }

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.RED));
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.RED));

      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.RED);
        row.push(t);
      }
      return row;
    },
    row3: () => {
      let row: Tile[] = [];
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW, new Token("Y1", COLOR.YELLOW, GAMETYPE.CLASSIC, new Position(2, 2))));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW, new Token("Y2", COLOR.YELLOW, GAMETYPE.CLASSIC, new Position(2, 3))));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));

      row.push(new Tile(TILETYPE.SAVETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.RED));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED, new Token("R1", COLOR.RED, GAMETYPE.CLASSIC, new Position(2, 11))));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED, new Token("R2", COLOR.RED, GAMETYPE.CLASSIC, new Position(2, 12))));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      return row;
    },
    row4: () => {
      let row: Tile[] = [];
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW, new Token("Y3", COLOR.YELLOW, GAMETYPE.CLASSIC, new Position(3, 2))));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW, new Token("Y4", COLOR.YELLOW, GAMETYPE.CLASSIC, new Position(3, 3))));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.RED));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED, new Token("R3", COLOR.RED, GAMETYPE.CLASSIC, new Position(3, 11))));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED, new Token("R4", COLOR.RED, GAMETYPE.CLASSIC, new Position(3, 12))));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      return row;
    },
    row5: () => {
      let row: Tile[] = [];
      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.YELLOW);
        row.push(t);
      }

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.RED));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.RED);
        row.push(t);
      }
      return row;
    },
    row6: () => {
      let row: Tile[] = [];
      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.YELLOW);
        row.push(t);
      }

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.RED));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.RED);
        row.push(t);
      }
      return row;
    },
    row7: () => {
      let row: Tile[] = [];
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.YELLOW));
      for (let i = 0; i < 4; i++) {
        row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      }

      row.push(new Tile(TILETYPE.NONE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMETILE, COLOR.RED));
      row.push(new Tile(TILETYPE.NONE, COLOR.NONE));

      for (let i = 0; i < 3; i++) {
        row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      }
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      return row;
    },
    row8: () => {
      let row: Tile[] = [];
      row.push(new Tile(TILETYPE.HOMEENTRY, COLOR.YELLOW));
      for (let i = 0; i < 5; i++) {
        row.push(new Tile(TILETYPE.HOMEPATH, COLOR.YELLOW));
      }

      row.push(new Tile(TILETYPE.HOMETILE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.NONE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMETILE, COLOR.GREEN));

      for (let i = 0; i < 5; i++) {
        row.push(new Tile(TILETYPE.HOMEPATH, COLOR.GREEN));
      }
      row.push(new Tile(TILETYPE.HOMEENTRY, COLOR.GREEN));
      return row;
    },
    row9: () => {
      let row: Tile[] = [];
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.NONE));
      for (let i = 0; i < 3; i++) {
        row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      }

      row.push(new Tile(TILETYPE.NONE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMETILE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.NONE, COLOR.NONE));

      for (let i = 0; i < 4; i++) {
        row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      }
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.GREEN));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      return row;
    },
    row10: () => {

      let row: Tile[] = [];
      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.BLUE);
        row.push(t);
      }

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.BLUE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.GREEN);
        row.push(t);
      }
      return row;
    },
    row11: () => {
      let row: Tile[] = [];
      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.BLUE);
        row.push(t);
      }

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.BLUE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.GREEN);
        row.push(t);
      }
      return row;
    },
    row12: () => {
      let row: Tile[] = [];
      let b1: any = new Token("B1", COLOR.BLUE, GAMETYPE.CLASSIC, new Position(11, 2));
      let b2: any = new Token("B2", COLOR.BLUE, GAMETYPE.CLASSIC, new Position(11, 3));

      let g1: any = new Token("G1", COLOR.GREEN, GAMETYPE.CLASSIC, new Position(11, 11));
      let g2: any = new Token("G2", COLOR.GREEN, GAMETYPE.CLASSIC, new Position(11, 12));

      if (this.noOfPlayers < 3) {
        b1 = undefined;
        b2 = undefined;
        g1 = undefined;
        g2 = undefined;
      }

      if (this.noOfPlayers == 3) {
        b1 = undefined;
        b2 = undefined;
      }

      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE, b1));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE, b2));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.BLUE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN, g1));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN, g2));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      return row;
    },
    row13: () => {
      let row: Tile[] = [];

      let b3: any = new Token("B3", COLOR.BLUE, GAMETYPE.CLASSIC, new Position(12, 2));
      let b4: any = new Token("B4", COLOR.BLUE, GAMETYPE.CLASSIC, new Position(12, 3));

      let g3: any = new Token("G3", COLOR.GREEN, GAMETYPE.CLASSIC, new Position(12, 11));
      let g4: any = new Token("G4", COLOR.GREEN, GAMETYPE.CLASSIC, new Position(12, 12));

      if (this.noOfPlayers < 3) {
        b3 = undefined;
        b4 = undefined;
        g3 = undefined;
        g4 = undefined;
      }

      if (this.noOfPlayers == 3) {
        b3 = undefined;
        b4 = undefined;
      }


      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE, b3));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE, b4));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.BLUE));
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.NONE));

      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN, g3));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN, g4));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      return row;
    },
    row14: () => {
      let row: Tile[] = [];
      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.BLUE);
        row.push(t);
      }

      row.push(new Tile(TILETYPE.SAVETILE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.BLUE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.GREEN);
        row.push(t);
      }
      return row;

    },
    row15: () => {
      let row: Tile[] = [];
      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.BLUE);
        row.push(t);
      }

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEENTRY, COLOR.BLUE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      for (let i = 0; i < 6; i++) {
        let t = new Tile(TILETYPE.NONE, COLOR.GREEN);
        row.push(t);
      }
      return row;
    }
  }

  /**
   * classicBoardBuilder : An object containing different row builder functions for mini board
   * which returns the row, which can be appended back to the main board game array.
   */
  private miniBoardBuilder: any = {
    row1: () => {
      let row: Tile[] = [];
      for (let i = 0; i < 4; i++) {
        row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));
      }
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEENTRY, COLOR.RED));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      for (let i = 0; i < 4; i++) {
        row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      }

      return row;

    },
    row2: () => {
      let row: Tile[] = [];
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW, new Token("Y1", COLOR.YELLOW, GAMETYPE.MINI, new Position(1, 1))));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW, new Token("Y2", COLOR.YELLOW, GAMETYPE.MINI, new Position(1, 2))));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.RED));
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.RED));

      row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED, new Token("R1", COLOR.RED, GAMETYPE.MINI, new Position(1, 8))));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED, new Token("R2", COLOR.RED, GAMETYPE.MINI, new Position(1, 9))));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED));

      return row;


    },
    row3: () => {
      let row: Tile[] = [];
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW, new Token("Y3", COLOR.YELLOW, GAMETYPE.MINI, new Position(2, 1))));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW, new Token("Y4", COLOR.YELLOW, GAMETYPE.MINI, new Position(2, 2))));
      row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.RED));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED, new Token("R3", COLOR.RED, GAMETYPE.MINI, new Position(2, 8))));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED, new Token("R4", COLOR.RED, GAMETYPE.MINI, new Position(2, 9))));
      row.push(new Tile(TILETYPE.NONE, COLOR.RED));

      return row;


    },
    row4: () => {
      let row: Tile[] = [];
      for (let i = 0; i < 4; i++) {
        row.push(new Tile(TILETYPE.NONE, COLOR.YELLOW));
      }
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.RED));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      for (let i = 0; i < 4; i++) {
        row.push(new Tile(TILETYPE.NONE, COLOR.RED));
      }

      return row;

    },
    row5: () => {
      let row: Tile[] = [];
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      row.push(new Tile(TILETYPE.NONE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMETILE, COLOR.RED));
      row.push(new Tile(TILETYPE.NONE, COLOR.NONE));

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.NONE));

      return row;

    },
    row6: () => {
      let row: Tile[] = [];
      row.push(new Tile(TILETYPE.HOMEENTRY, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.YELLOW));

      row.push(new Tile(TILETYPE.HOMETILE, COLOR.YELLOW));
      row.push(new Tile(TILETYPE.NONE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMETILE, COLOR.GREEN));

      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.GREEN));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.GREEN));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.GREEN));
      row.push(new Tile(TILETYPE.HOMEENTRY, COLOR.GREEN));

      return row;

    },
    row7: () => {
      let row: Tile[] = [];
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      row.push(new Tile(TILETYPE.NONE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMETILE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.NONE, COLOR.NONE));

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.GREEN));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      return row;

    },
    row8: () => {
      let row: Tile[] = [];
      for (let i = 0; i < 4; i++) {
        row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));
      }
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.BLUE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      for (let i = 0; i < 4; i++) {
        row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      }

      return row;

    },
    row9: () => {
      let row: Tile[] = [];

      let b1: any = new Token("B1", COLOR.BLUE, GAMETYPE.MINI, new Position(8, 1));
      let b2: any = new Token("B2", COLOR.BLUE, GAMETYPE.MINI, new Position(8, 2));

      let g1: any = new Token("G1", COLOR.GREEN, GAMETYPE.MINI, new Position(8, 8));
      let g2: any = new Token("G2", COLOR.GREEN, GAMETYPE.MINI, new Position(8, 9));

      if (this.noOfPlayers < 3) {
        b1 = undefined;
        b2 = undefined;
        g1 = undefined;
        g2 = undefined;
      }

      if (this.noOfPlayers == 3) {
        b1 = undefined;
        b2 = undefined;
      }

      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE, b1));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE, b2));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));

      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.BLUE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN, g1));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN, g2));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));

      return row;

    },
    row10: () => {
      let row: Tile[] = [];

      let b3: any = new Token("B3", COLOR.BLUE, GAMETYPE.MINI, new Position(9, 1));
      let b4: any = new Token("B4", COLOR.BLUE, GAMETYPE.MINI, new Position(9, 2));

      let g3: any = new Token("G3", COLOR.GREEN, GAMETYPE.MINI, new Position(9, 8));
      let g4: any = new Token("G4", COLOR.GREEN, GAMETYPE.MINI, new Position(9, 9));

      if (this.noOfPlayers < 3) {
        b3 = undefined;
        b4 = undefined;
        g3 = undefined;
        g4 = undefined;
      }

      if (this.noOfPlayers == 3) {
        b3 = undefined;
        b4 = undefined;
      }

      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE, b3));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE, b4));
      row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));

      row.push(new Tile(TILETYPE.SAVETILE, COLOR.BLUE));
      row.push(new Tile(TILETYPE.HOMEPATH, COLOR.BLUE));
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));

      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN, g3));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN, g4));
      row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));

      return row;

    },
    row11: () => {
      let row: Tile[] = [];
      for (let i = 0; i < 4; i++) {
        row.push(new Tile(TILETYPE.NONE, COLOR.BLUE));
      }
      row.push(new Tile(TILETYPE.GAMETILE, COLOR.NONE));
      row.push(new Tile(TILETYPE.HOMEENTRY, COLOR.BLUE));
      row.push(new Tile(TILETYPE.SAVETILE, COLOR.NONE));

      for (let i = 0; i < 4; i++) {
        row.push(new Tile(TILETYPE.NONE, COLOR.GREEN));
      }

      return row;

    }
  }


  constructor() {
    this.gameboard = [];
    this.roomtype = ROOMTYPE.WAITING;
    this.diceURL = diceURLlist[1][0];
    this.turn = COLOR.YELLOW;
    this.players = [];
    this.gametype = GAMETYPE.NONE;
    this.noOfPlayers = 0;
    this.tokenPositions = {};
    this.dice = -1;
    this.ticker = 0;
    this.maxTime = 30;
    this.stopCommander = new Subject<boolean>();
    this.offline = true;
    this.roomname = "";
    this.roomid = "";
    this.turnMiss = new Subject<boolean>();

  }

  resetParameters() {
    this.gameboard = [];
    this.roomtype = ROOMTYPE.WAITING;
    this.diceURL = diceURLlist[1][0];
    this.turn = COLOR.YELLOW;
    this.players = [];
    this.gametype = GAMETYPE.NONE;
    this.noOfPlayers = 0;
    this.tokenPositions = {};
    this.dice = -1;
    this.ticker = 0;
    this.maxTime = 30;
    this.roomtype = ROOMTYPE.WAITING;
  }

  /**
   * @param players
   * prepares all parameters for classic game, sets up board and players. 
   */

  createClassicGame(players: Player[], offline: boolean, roomname: string, roomid: string = "") {

    this.roomname = roomname;
    this.roomtype = ROOMTYPE.GAME;
    this.roomid = roomid;
    this.noOfPlayers = players.length;
    this.gametype = GAMETYPE.CLASSIC;
    this.players = players;

    if (this.players.length == 4) {
      this.tokenPositions = {
        1: {
          Y1: {
            x: 2,
            y: 2,
          },
          Y2: {
            x: 2,
            y: 3
          },
          Y3: {
            x: 3,
            y: 2
          },
          Y4: {
            x: 3,
            y: 3
          }
        },
        2: {
          R1: {
            x: 2,
            y: 11,
          },
          R2: {
            x: 2,
            y: 12
          },
          R3: {
            x: 3,
            y: 11
          },
          R4: {
            x: 3,
            y: 12
          }
        },
        3: {
          G1: {
            x: 11,
            y: 11,
          },
          G2: {
            x: 11,
            y: 12
          },
          G3: {
            x: 12,
            y: 11
          },
          G4: {
            x: 12,
            y: 12
          }
        },
        4: {
          B1: {
            x: 11,
            y: 2,
          },
          B2: {
            x: 11,
            y: 3
          },
          B3: {
            x: 12,
            y: 2
          },
          B4: {
            x: 12,
            y: 3
          }
        }
      }
    } else if (this.players.length == 3) {
      this.tokenPositions = {
        1: {
          Y1: {
            x: 2,
            y: 2,
          },
          Y2: {
            x: 2,
            y: 3
          },
          Y3: {
            x: 3,
            y: 2
          },
          Y4: {
            x: 3,
            y: 3
          }
        },
        2: {
          R1: {
            x: 2,
            y: 11,
          },
          R2: {
            x: 2,
            y: 12
          },
          R3: {
            x: 3,
            y: 11
          },
          R4: {
            x: 3,
            y: 12
          }
        },
        3: {
          G1: {
            x: 11,
            y: 11,
          },
          G2: {
            x: 11,
            y: 12
          },
          G3: {
            x: 12,
            y: 11
          },
          G4: {
            x: 12,
            y: 12
          }
        }
      }
    } else if (this.players.length == 2) {
      this.tokenPositions = {
        1: {
          Y1: {
            x: 2,
            y: 2,
          },
          Y2: {
            x: 2,
            y: 3
          },
          Y3: {
            x: 3,
            y: 2
          },
          Y4: {
            x: 3,
            y: 3
          }
        },
        2: {
          R1: {
            x: 2,
            y: 11,
          },
          R2: {
            x: 2,
            y: 12
          },
          R3: {
            x: 3,
            y: 11
          },
          R4: {
            x: 3,
            y: 12
          }
        }
      }
    }

    for (let row in this.classicBoardBuilder) {
      let r = (this.classicBoardBuilder[row])();
      this.gameboard.push(r);
    }

    this.offline = offline;
    this.initiateTimer(30);

  }

  /**
   * @param players
   * prepares all parameters for mini game, sets up board and players. 
   */
  createMiniGame(players: Player[], offline: boolean, roomname: string, roomid: string = "") {

    this.roomname = roomname;
    this.roomid = roomid;
    this.noOfPlayers = players.length;
    this.gametype = GAMETYPE.MINI;
    this.players = players;
    this.roomtype = ROOMTYPE.GAME;

    if (this.players.length == 4) {
      this.tokenPositions = {
        1: {
          Y1: {
            x: 1,
            y: 1,
          },
          Y2: {
            x: 1,
            y: 2
          },
          Y3: {
            x: 2,
            y: 1
          },
          Y4: {
            x: 2,
            y: 2
          }
        },
        2: {
          R1: {
            x: 1,
            y: 8,
          },
          R2: {
            x: 1,
            y: 9
          },
          R3: {
            x: 2,
            y: 8
          },
          R4: {
            x: 2,
            y: 9
          }
        },
        3: {
          G1: {
            x: 8,
            y: 8,
          },
          G2: {
            x: 8,
            y: 9
          },
          G3: {
            x: 9,
            y: 8
          },
          G4: {
            x: 9,
            y: 9
          }
        },
        4: {
          B1: {
            x: 8,
            y: 1,
          },
          B2: {
            x: 8,
            y: 2
          },
          B3: {
            x: 9,
            y: 1
          },
          B4: {
            x: 9,
            y: 2
          }
        }
      }
    } else if (this.players.length == 3) {
      this.tokenPositions = {
        1: {
          Y1: {
            x: 1,
            y: 1,
          },
          Y2: {
            x: 1,
            y: 2
          },
          Y3: {
            x: 2,
            y: 1
          },
          Y4: {
            x: 2,
            y: 2
          }
        },
        2: {
          R1: {
            x: 1,
            y: 8,
          },
          R2: {
            x: 1,
            y: 9
          },
          R3: {
            x: 2,
            y: 8
          },
          R4: {
            x: 2,
            y: 9
          }
        },
        3: {
          G1: {
            x: 8,
            y: 8,
          },
          G2: {
            x: 8,
            y: 9
          },
          G3: {
            x: 9,
            y: 8
          },
          G4: {
            x: 9,
            y: 9
          }
        }
      }
    } else if (this.players.length == 2) {
      this.tokenPositions = {
        1: {
          Y1: {
            x: 1,
            y: 1,
          },
          Y2: {
            x: 1,
            y: 2
          },
          Y3: {
            x: 2,
            y: 1
          },
          Y4: {
            x: 2,
            y: 2
          }
        },
        2: {
          R1: {
            x: 1,
            y: 8,
          },
          R2: {
            x: 1,
            y: 9
          },
          R3: {
            x: 2,
            y: 8
          },
          R4: {
            x: 2,
            y: 9
          }
        }
      }
    }

    for (let row in this.miniBoardBuilder) {
      let r = (this.miniBoardBuilder[row])();
      this.gameboard.push(r);
    }


    this.offline = offline;
    this.initiateTimer(30);

  }

  /**
   * @param tokenid 
   * @returns Position
   * returns current position of a token on the gameboard;
   */
  findPresentPosition(tokenid: string) {
    let color: COLOR = COLOR.NONE;

    if (tokenid[0] == "R") {
      color = COLOR.RED;
    } else if (tokenid[0] == "B") {
      color = COLOR.BLUE;
    } else if (tokenid[0] == "G") {
      color = COLOR.GREEN;
    } else {
      color = COLOR.YELLOW;
    }

    return (this.tokenPositions[color])[tokenid]
  }

  /**
   * 
   * @param tokenid 
   * @param posi 
   * This function takes in token id and new position , and changes the tokenPositions object.
   */
  changeCurrentPositionObject(tokenid: string, posi: Position) {
    let color: COLOR = COLOR.NONE;
    if (tokenid[0] == "R") {
      color = COLOR.RED;
    } else if (tokenid[0] == "Y") {
      color = COLOR.YELLOW;
    } else if (tokenid[0] == "B") {
      color = COLOR.BLUE;
    } else if (tokenid[0] == "G") {
      color = COLOR.GREEN;
    }

    (this.tokenPositions[color])[tokenid] = posi;

  }

  /**
   * 
   * @returns dice number
   * This function generates random number from 1-6, with high probability of 2-5 and low probability of 1&6.
   */
  throwDice() {
    // Also include to stop the timer.
    let dice = -1;

    while (1) {
      let t = Math.floor(Math.random() * 10);
      if (t >= 1 && t <= 6) {
        dice = t;
        break;
      }
    }

    return dice;
  }

  /**
   * 
   * @param maxTime 
   * This function will initiate timer, on providing maximum time. will stop automatically after timer runs out.
   */
  initiateTimer(maxTime: number) {
    this.maxTime = 20 * maxTime;
    interval(50).pipe(takeUntil(this.stopCommander)).subscribe((val: number) => {
      this.ticker = val;
      if (val == this.maxTime) {
        this.stopCommander.next(true);
        // Turn change function here.
        this.turnMiss.next(true);
      }
    });
  }

  /**
   * 
   * @param op 
   * @returns new position
   * This function will determine next position based on dice number on a classic board.
   */
  findNewPositionClassic(op: Position) {
    let currentDice = this.dice;

    while (currentDice--) {
      if (op.x == 6) {
        if (op.y != 5 && op.y != 14) {
          op.y++;
        } else {
          if (op.y == 5) {
            op.x = 5;
            op.y = 6;
          } else {
            op.x = 7;
          }

        }
      } else if (op.y == 6) {
        if (op.x != 0 && op.x != 9) {
          op.x--;
        } else {
          if (op.x == 0) {
            op.y = 7;
          } else {
            op.x = 8;
            op.y = 5;
          }
        }
      } else if (op.x == 8) {
        if (op.y != 0 && op.y != 9) {
          op.y--;
        } else {
          if (op.y == 0) {
            op.x = 7;
          } else {
            op.x = 9;
            op.y = 8;
          }
        }
      } else if (op.y == 8) {
        if (op.x != 5 && op.x != 14) {
          op.x++;
        } else {
          if (op.x == 5) {
            op.x = 6;
            op.y = 9;
          } else {
            op.y = 7;
          }
        }
      } else if (op.x == 7 && op.y == 0) {
        if (this.turn != COLOR.YELLOW) {
          op.x--;
        } else {
          op.y++;
        }
      } else if (op.x == 0 && op.y == 7) {
        if (this.turn != COLOR.RED) {
          op.y++;
        } else {
          op.x++;
        }
      } else if (op.x == 7 && op.y == 14) {
        if (this.turn != COLOR.GREEN) {
          op.x++;
        } else {
          op.y--;
        }
      } else if (op.x == 14 && op.y == 7) {
        if (this.turn != COLOR.BLUE) {
          op.y--;
        } else {
          op.x--;
        }
      } else if (op.x == 7 && op.y < 6 && op.y > 0) {
        op.y++;
      } else if (op.y == 7 && op.x > 0 && op.x < 6) {
        op.x++;
      } else if (op.x == 7 && op.y < 14 && op.y > 8) {
        op.y--;
      } else if (op.y == 7 && op.x < 14 && op.x > 8) {
        op.x--;
      }
    }

    return op;
  }


  findNewPositionMini(op: Position) {
    let currentDice = this.dice;

    while (currentDice--) {
      if (op.x == 4) {
        if (op.y != 3 && op.y != 10) {
          op.y++;
        } else if (op.y == 3) {
          op.x = 3;
          op.y = 4;
        } else {
          op.x = 5;
        }
      } else if (op.y == 4) {
        if (op.x != 7 && op.x != 0) {
          op.x--;
        } else if (op.x == 7) {
          op.x = 6;
          op.y = 3;
        } else {
          op.y = 5;
        }
      } else if (op.y == 6) {
        if (op.x != 3 && op.x != 10) {
          op.x++;
        } else if (op.x == 3) {
          op.x = 4;
          op.y = 7;
        } else {
          op.y = 5;
        }
      } else if (op.x == 6) {
        if (op.y != 0 && op.y != 7) {
          op.y--;
        } else if (op.y == 7) {
          op.x = 7;
          op.y = 6;
        } else {
          op.x = 5;
        }
      } else if (op.x == 5 && op.y == 0) {
        if (this.turn != COLOR.YELLOW) {
          op.x = 4;
        } else {
          op.y++;
        }
      } else if (op.x == 0 && op.y == 5) {
        if (this.turn != COLOR.RED) {
          op.y = 6;
        } else {
          op.x++;
        }
      } else if (op.x == 5 && op.y == 10) {
        if (this.turn != COLOR.GREEN) {
          op.x = 6;
        } else {
          op.y--;
        }
      } else if (op.x == 10 && op.y == 5) {
        if (this.turn != COLOR.BLUE) {
          op.y = 4;
        } else {
          op.x--;
        }
      } else if (op.x == 5 && op.y < 4 && op.y > 0) {
        op.y++;
      } else if (op.y == 5 && op.x < 4 && op.x > 0) {
        op.x++;
      } else if (op.x == 5 && op.y > 6 && op.y < 10) {
        op.y--;
      } else if (op.y == 5 && op.x > 6 && op.x < 10) {
        op.x--;
      }
    }



    return op;
  }

  /**
   * This function highlights all the eligible tiles for current dice number and turn color
   */
  highlightEligibleTiles() {
    let elig: boolean = false;
    for (let tokenid in this.tokenPositions[this.turn]) {
      let cp: Position = (this.tokenPositions[this.turn])[tokenid];
      let tok = this.gameboard[cp.x][cp.y].getSingleTokenInfo(tokenid);
      if (tok?.stepsToTake != undefined) {
        if (this.dice <= tok.stepsToTake) {
          if (this.dice == 6 || this.dice == 1) {
            if (this.gameboard[cp.x][cp.y].type == TILETYPE.NONE && this.gameboard[cp.x][cp.y].color != 0) {
              elig = true;
              this.gameboard[cp.x][cp.y].eligible = true;
            }
          }

          if (this.gameboard[cp.x][cp.y].type != TILETYPE.NONE && this.gameboard[cp.x][cp.y].type != TILETYPE.HOMETILE) {
            elig = true;
            this.gameboard[cp.x][cp.y].eligible = true;
          }
        }
      }
    }
    return elig;
  }

  /**
   * This function disables all eligible tiles, making them virgin again for next turn person.
   * Non eligible tiles cannot be clicked, so it will also avoid any click misuse.
   */
  disableAllEligible() {
    for (let i = 0; i < this.gameboard.length; i++) {
      for (let j = 0; j < this.gameboard[i].length; j++) {
        this.gameboard[i][j].eligible = false;
      }
    }
  }

  assignRank(color: COLOR) {
    let ip = 0;
    let maxRank = -1;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].color == color) {
        ip = i;
      }
      if (this.players[i].rank > maxRank) {
        maxRank = this.players[i].rank;
      }

    }

    if (maxRank == -1) {
      this.players[ip].rank = 1;
    } else {
      this.players[ip].rank = maxRank + 1;
    }
  }

  changeTurn() {
    let i = 0;
    for (let pl of this.players) {
      if (pl.color == this.turn) break;
      i++;
    }

    if (i == this.players.length - 1) {
      i = 0;
    } else {
      i++;
    }

    let rankers = 0;
    let last: any;

    for (let p of this.players) {
      if (p.rank != -1) {
        rankers++;
      } else {
        last = p.color;
      }
    }

    if (rankers == this.noOfPlayers - 1) {
      return ({ status: "GAMEOVER", last: last });
    } else {
      while (1) {
        if (this.players[i].rank == -1) {
          break;
        }
        if (i == this.players.length - 1) {
          i = 0;
        } else {
          i++;
        }
      }
    }

    this.turn = this.players[i].color;
    this.ticker = 0;
    this.dice = -1;
    return ({ status: "CONTINUE" });
  }

  placeOnNewPosition(tokenid: string, np: Position): any {

    let response = {
      clash: false,
      newDual: false,
      dualMovement: false
    }
    let color: COLOR = COLOR.NONE;

    if (tokenid[0] == "R") {
      color = COLOR.RED;
    } else if (tokenid[0] == "Y") {
      color = COLOR.YELLOW;
    } else if (tokenid[0] == "B") {
      color = COLOR.BLUE;
    } else {
      color = COLOR.GREEN;
    }

    let op: Position = (this.tokenPositions[color])[tokenid];

    let token: any = this.gameboard[op.x][op.y].getSingleTokenInfo(tokenid);

    if (token?.dual) {

      console.log("MOVING A DUAL TOKEN");
      response.dualMovement = true;
      let allTokens = this.gameboard[op.x][op.y].getAllTokenInfo(color);
      let tok2: any = undefined;
      for (let t of allTokens) {
        if (t.id != tokenid && t.color == color && t.dual) {
          tok2 = t;
          break;
        }
      }

      if (this.gameboard[np.x][np.y].type == TILETYPE.HOMEPATH || this.gameboard[np.x][np.y].type == TILETYPE.SAVETILE) {
        tok2?.deactivateDual();
        token.deactivateDual();
      }

      this.gameboard[op.x][op.y].removeToken(tokenid);
      this.gameboard[op.x][op.y].removeToken(String(tok2?.id));
      this.gameboard[op.x][op.y].refactorTokenObject();
      token.reduceSteps(this.dice);
      tok2?.reduceSteps(this.dice);

      this.gameboard[np.x][np.y].addToken(token);
      this.changeCurrentPositionObject(token.id, np);
      this.gameboard[np.x][np.y].addToken(tok2);
      this.changeCurrentPositionObject(tok2.id, np);



    } else {
      let clasher = this.gameboard[np.x][np.y].checkForClash(this.turn);
      if (clasher.clash) {
        console.log("CLASH ENCOUNTERED");
        response.clash = true;
        this.gameboard[np.x][np.y].removeToken(clasher.token.id);
        this.gameboard[np.x][np.y].refactorTokenObject();

        if (this.gametype == GAMETYPE.CLASSIC) {
          clasher.token.resetStepsClassic();
        } else {
          clasher.token.resetStepsMini();
        }
        this.gameboard[clasher.token.homePosition.x][clasher.token.homePosition.y].addToken(clasher.token);
        this.changeCurrentPositionObject(clasher.token.id, clasher.token.homePosition);
        this.gameboard[op.x][op.y].removeToken(tokenid);
        this.gameboard[op.x][op.y].refactorTokenObject();
        token.reduceSteps(this.dice);

        this.gameboard[np.x][np.y].addToken(token);
        this.changeCurrentPositionObject(token.id, np);

      } else {
        // No Clash. Check for any new dual formations on new position.
        let df = this.gameboard[np.x][np.y].dualPossibility(this.turn)
        if (df.possiblity) {
          console.log("FORMING NEW DUAL");
          response.newDual = true;
          this.gameboard[np.x][np.y].editTokenData(df.token.id, undefined, true);
          this.gameboard[op.x][op.y].removeToken(tokenid);
          this.gameboard[op.x][op.y].refactorTokenObject();
          token.reduceSteps(this.dice);
          token?.activateDual();
          this.gameboard[np.x][np.y].addToken(token);
          this.changeCurrentPositionObject(token.id, np);

        } else {
          console.log("JUST ADD THE TOKEN");
          this.gameboard[op.x][op.y].removeToken(tokenid);
          this.gameboard[op.x][op.y].refactorTokenObject();
          token.reduceSteps(this.dice);
          this.gameboard[np.x][np.y].addToken(token);
          this.changeCurrentPositionObject(token.id, np);

        }
      }

    }

    this.changeCurrentPositionObject(tokenid, np);

    return response;
  }

  unlockToken(op: Position) {
    let token = (this.gameboard[op.x][op.y].getAllTokenInfo(this.turn))[0];

    this.gameboard[op.x][op.y].removeToken(token.id);
    this.gameboard[op.x][op.y].refactorTokenObject();

    this.gameboard[token.startPosition.x][token.startPosition.y].addToken(token);
    this.changeCurrentPositionObject(token.id, new Position(token.startPosition.x, token.startPosition.y));
  }

  diceURLSet() {
    if (this.dice == -1) {
      this.diceURL = (diceURLlist[this.turn])[0];
    } else {
      this.diceURL = (diceURLlist[this.turn])[this.dice];
    }
  }

  /**
   * 
   * @param tokens 
   * This function will return whether this array contains only single tokens, or duals or both.
   */
  tokenPresenceCheck(tokens: Token[]) {
    let response = {
      single: false,
      dual: false
    }

    for (let t of tokens) {
      if (t.dual) {
        response.dual = true;
      } else {
        response.single = true;
      }
    }

    return response;
  }

  isItLocked(i: number, j: number) {
    if (this.gametype == GAMETYPE.CLASSIC) {
      if ((i == 2 && j == 2) || (i == 2 && j == 3) || (i == 3 && j == 2) || (i == 3 && j == 3) || (i == 2 && j == 11) || (i == 2 && j == 12) || (i == 3 && j == 11) || (i == 3 && j == 12) || (i == 11 && j == 2) || (i == 11 && j == 3) || (i == 12 && j == 2) || (i == 12 && j == 3) || (i == 11 && j == 11) || (i == 11 && j == 12) || (i == 12 && j == 11) || (i == 12 && j == 12)) {
        return true;
      } else {
        return false;
      }
    } else {
      if ((i == 1 && j == 1) || (i == 1 && j == 2) || (i == 2 && j == 1) || (i == 2 && j == 2) || (i == 1 && j == 8) || (i == 1 && j == 9) || (i == 2 && j == 8) || (i == 2 && j == 9) || (i == 8 && j == 1) || (i == 8 && j == 2) || (i == 9 && j == 1) || (i == 9 && j == 2) || (i == 8 && j == 8) || (i == 8 && j == 9) || (i == 9 && j == 8) || (i == 9 && j == 9)) {
        return true;
      } else {
        return false;
      }
    }

  }

  retainTurn() {
    this.stopCommander.next(true);
    this.dice = -1;
    this.ticker = 0;
    this.diceURLSet();
    this.initiateTimer(30);
  }


  updateRank() {
    let homePositions: any = {};

    if (this.gametype == GAMETYPE.CLASSIC) {
      homePositions = {
        1: new Position(7, 6),
        2: new Position(6, 7),
        3: new Position(7, 8),
        4: new Position(8, 7)
      }
    } else {
      homePositions = {
        1: new Position(5, 4),
        2: new Position(4, 5),
        3: new Position(5, 6),
        4: new Position(6, 5)
      }
    }

    for (let p in homePositions) {
      if (this.gameboard[homePositions[Number(p)].x][homePositions[Number(p)].y].tokens.MULTIPLE[Number(p)].length == 4) {
        if (this.players[Number(p) - 1].rank == -1) {
          this.assignRank(Number(p));
        }
      }
    }
  }

  isGameOver() {
    let go = 0;
    let tp = 0;

    for (let p of this.players) {

      if (p.online) {
        tp++;
      }

      if (p.rank != -1 && p.online) {
        go++;
      }
    }

    if (go >= tp - 1) {
      return true;
    } else return false;
  }

  resetTokens(color: COLOR) {
    for (let token in this.tokenPositions[color]) {
      let tp = (this.tokenPositions[color])[token];
      let tok = this.gameboard[tp.x][tp.y].removeToken(token);
      this.gameboard[tp.x][tp.y].refactorTokenObject();
      if (this.gametype == GAMETYPE.CLASSIC) {
        tok.resetStepsClassic();
      } else {
        tok.resetStepsMini();
      }
      tok.deactivateDual();
      this.gameboard[tok.homePosition.x][tok.homePosition.y].addToken(tok);
      this.changeCurrentPositionObject(token, tok.homePosition);
    }
  }
}



