import { COLOR } from "../enum/color.enum";
import { GAMETYPE } from "../enum/gametype.enum";
import { ROOMTYPE } from "../enum/roomtype.enum";

export class Player {

    username: string;
    userid: undefined | string;
    roomtype: ROOMTYPE;
    roomid: undefined | string;
    color: COLOR;
    rank: number;
    mute: undefined | boolean;
    online: undefined | boolean;
    host: boolean;


    constructor(username: string, roomtype: ROOMTYPE, color: COLOR, host: boolean, userid: undefined | string = undefined, roomid: undefined | string = undefined, mute: undefined | boolean = undefined, online: undefined | boolean = true) {

        this.username = username;
        this.userid = userid;
        this.roomtype = roomtype;
        this.roomid = roomid;
        this.color = color;
        this.rank = -1;
        this.mute = mute;
        this.online = online;
        this.host = host;

    }

}
