import { COLOR } from "../enum/color.enum";

export class Chat {

    message: string;
    sendername: string;
    sendercolor: COLOR;
    senderid: string;

    constructor(sendername: string, message: string, sendercolor: COLOR, senderid: string) {
        this.message = message;
        this.senderid = senderid;
        this.sendername = sendername;
        this.sendercolor = sendercolor;
    }
}
