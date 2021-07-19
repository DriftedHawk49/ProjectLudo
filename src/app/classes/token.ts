import { COLOR } from "../enum/color.enum";
import { GAMETYPE } from "../enum/gametype.enum";
import { Position } from "./position";

const classicBluePosition: Position = new Position(13, 6);
const miniBluePosition: Position = new Position(9, 4);

const classicYellowPosition: Position = new Position(6, 1);
const miniYellowPosition: Position = new Position(4, 1);

const classicRedPosition: Position = new Position(1, 8);
const miniRedPosition: Position = new Position(1, 6);

const classicGreenPosition: Position = new Position(8, 13);
const miniGreenPosition: Position = new Position(6, 9);

export class Token {
    id: string;
    color: COLOR;
    homePosition: Position;
    startPosition: Position;
    dual: boolean;
    stepsToTake: number;

    constructor(id: string, color: COLOR, gametype: GAMETYPE, homePosition: Position) {
        this.dual = false;
        this.id = id;
        this.color = color;
        this.homePosition = homePosition;

        if (gametype == GAMETYPE.MINI) {
            this.stepsToTake = 38
        } else {
            this.stepsToTake = 56;
        }

        if (gametype == GAMETYPE.CLASSIC) {
            if (color == COLOR.YELLOW) {
                this.startPosition = classicYellowPosition;
            } else if (color == COLOR.BLUE) {
                this.startPosition = classicBluePosition;
            } else if (color == COLOR.RED) {
                this.startPosition = classicRedPosition;
            } else {
                this.startPosition = classicGreenPosition;
            }
        } else {
            if (color == COLOR.YELLOW) {
                this.startPosition = miniYellowPosition;
            } else if (color == COLOR.BLUE) {
                this.startPosition = miniBluePosition;
            } else if (color == COLOR.RED) {
                this.startPosition = miniRedPosition;
            } else {
                this.startPosition = miniGreenPosition;
            }
        }
    }

    activateDual() {
        this.dual = true;
    }

    deactivateDual() {
        this.dual = false;
    }

    reduceSteps(steps: number) {
        this.stepsToTake-=steps;
    }

    resetStepsClassic(){
        this.stepsToTake = 56;
    }

    resetStepsMini(){
        this.stepsToTake = 38;
    }
}
