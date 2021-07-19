export class Invites {
    roomname: string;
    roomid: string;
    noOfPlayers: number;
    sendername: string;

    constructor(roomid: string, roomname: string, noOfPlayers: number, senderName: string) {
        this.roomname = roomname;
        this.roomid = roomid;
        this.noOfPlayers = noOfPlayers;
        this.sendername = senderName;
    }


}
