export class Rooms {
    roomname: string;
    roomid: string;
    noOfPlayers: number;

    constructor(roomname: string, roomid: string, noOfPlayers: number) {
        this.roomname = roomname;
        this.roomid = roomid;
        this.noOfPlayers = noOfPlayers;
    }
}
