export class OnlinePlayers {

    username: string;
    userid: string;
    invited: boolean;

    constructor(playername: string, playerid: string) {
        this.username = playername;
        this.userid = playerid;
        this.invited = false;
    }

}
