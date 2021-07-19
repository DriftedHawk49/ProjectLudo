import { COLOR } from "../enum/color.enum";
import { TILETYPE } from "../enum/tiletype.enum";
import { TOKENTYPE } from "../enum/tokentype.enum";
import { Token } from "./token";

export class Tile {

    type: TILETYPE;
    color: COLOR;
    eligible: boolean;
    tokenPresent: boolean;
    tokenType: TOKENTYPE;
    tokens: any;

    constructor(type: TILETYPE, color: COLOR, token: undefined | Token = undefined) {
        this.type = type;
        this.color = color;
        this.eligible = false;
        if (token == undefined) {
            this.tokenPresent = false;
            this.tokenType = TOKENTYPE.UNDEFINED;
        } else {
            this.tokenPresent = true;
            this.tokenType = TOKENTYPE.SINGLE;
        }
        if (token == undefined) {
            this.tokens = {
                "SINGLE": undefined,
                "MULTIPLE": {
                    1: [],
                    2: [],
                    3: [],
                    4: []
                }
            };
        } else {
            this.tokens = {
                "SINGLE": token,
                "MULTIPLE": {
                    1: [],
                    2: [],
                    3: [],
                    4: []
                }
            };
        }

    }

    /**
     * @function updateTokenMeta()
     * This function will update the tokenPresent and tokenType metas based on tokens object.
     */

    private updateTokenMeta() {
        let tp = false;
        if (this.tokens.SINGLE != undefined) {
            this.tokenPresent = true;
            this.tokenType = TOKENTYPE.SINGLE;
        } else if (this.tokens.MULTIPLE[1].length || this.tokens.MULTIPLE[2].length || this.tokens.MULTIPLE[3].length || this.tokens.MULTIPLE[4].length) {
            this.tokenPresent = true;
            this.tokenType = TOKENTYPE.MULTIPLE;
        } else {
            this.tokenPresent = false;
            this.tokenType = TOKENTYPE.UNDEFINED;
        }
    }

    /**
     * @function refactorTokenObject
     * This function will refactor token Object, to put it back in right condition, for example , after removing certain tokens, it will refactor if there is only 1 token present in that tile, so it will put it in SINGLE section, and similar refactoring, and at the end it will call updateTokenMeta function.
     */
    refactorTokenObject() {

        /* 
        1st. Find out how many tokens are present.
        2nd. if single token, then check is it in single token section, if not then pop it out and place it in single section.
        */

        let tokenCount = 0;

        if (this.tokens.SINGLE != undefined) {
            tokenCount++;
        }

        for (let t in this.tokens.MULTIPLE) {
            tokenCount += this.tokens.MULTIPLE[t].length;
        }


        if (tokenCount == 1) {
            if (this.tokens.SINGLE == undefined) {
                for (let t of Object.keys(this.tokens.MULTIPLE)) {
                    if (this.tokens.MULTIPLE[t].length) {
                        this.tokens.SINGLE = this.tokens.MULTIPLE[t].pop();
                        break;
                    };
                }
            }
        }

        this.updateTokenMeta();
    }

    /**
     * @function checkForClash()
     * @param color: COLOR
     * This function will check whether there is any clashing token present at this place, clashing to given color.
     * If clash is found, also returns the clashing token, but doesn't remove it from the array.
     */

    checkForClash(color: COLOR): any {
        let response = {
            clash: false,
            token: undefined
        }
        if (this.type == TILETYPE.GAMETILE || this.type == TILETYPE.HOMEENTRY) {
            if (this.tokenPresent) {
                if (this.tokenType == TOKENTYPE.SINGLE) {
                    if (this.tokens.SINGLE.color != color) {
                        response.clash = true;
                        response.token = this.tokens.SINGLE;
                        return response;
                    } else return response;
                } else if (this.tokenType == TOKENTYPE.MULTIPLE) {
                    for (let i = 1; i <= 4; i++) {
                        if (i != color) {
                            if (this.tokens.MULTIPLE[i].length) {
                                for (let t of this.tokens.MULTIPLE[i]) {
                                    if (!t.dual) {
                                        response.clash = true;
                                        response.token = t;
                                        return response;
                                    }
                                }
                            }
                        }
                    }

                    return response;
                } else {
                    return response;
                }
            } else {
                return response;
            }
        } else {
            return response;
        }
    }

    /**
     * @function getTokenInfo()
     * @param color: COLOR
     * This function will return token data present at this tile (will not remove it) for information
     */

    getAllTokenInfo(color: COLOR): Token[] {
        let tokenInformation: Token[] = []

        if (this.tokenPresent) {
            if (this.tokenType == TOKENTYPE.SINGLE) {
                if (this.tokens.SINGLE.color == color) {
                    tokenInformation.push(this.tokens.SINGLE);
                }
            } else if (this.tokenType == TOKENTYPE.MULTIPLE) {
                tokenInformation = this.tokens.MULTIPLE[color];
            }
        }

        return tokenInformation;
    }

    /**
     * 
     * @param tokenid 
     * @returns 
     * 
     * This function returns single token information against tokenid.
     */
    getSingleTokenInfo(tokenid: string) {
        let response: undefined | Token = undefined;
        let col: COLOR = COLOR.NONE;

        if (tokenid[0] == "R") {
            col = COLOR.RED;
        } else if (tokenid[0] == "Y") {
            col = COLOR.YELLOW;
        } else if (tokenid[0] == "B") {
            col = COLOR.BLUE;
        } else if (tokenid[0] == "G") {
            col = COLOR.GREEN;
        }

        if (this.tokenPresent) {
            if (this.tokenType == TOKENTYPE.SINGLE) {
                response = this.tokens.SINGLE;
            } else {
                for (let tok of this.tokens.MULTIPLE[col]) {
                    if (tok.id == tokenid) {
                        response = tok;
                        break;
                    }
                }
            }
        }

        return response;
    }

    /**
     * @function addToken()
     * @param token: Token
     * This function will add given token to present tile
     */

    addToken(token: undefined | Token) {

        if (token != undefined) {
            if (this.tokenPresent) {
                if (this.tokenType == TOKENTYPE.SINGLE) {
                    let temp = this.tokens.SINGLE;
                    this.tokens.SINGLE = undefined;
                    this.tokens.MULTIPLE[temp.color].push(temp);
                    this.tokens.MULTIPLE[token.color].push(token);
                    this.updateTokenMeta();
                } else if (this.tokenType == TOKENTYPE.MULTIPLE) {
                    this.tokens.MULTIPLE[token.color].push(token);
                    this.updateTokenMeta();
                }
            } else {
                this.tokens.SINGLE = token;
                this.updateTokenMeta();
            }
        }
    }


    /**
     * @function removeToken()
     * @param tokenID: string
     * This function will remove the token from this tile, and will return the removed token
     * 
     */

    removeToken(tokenid: string) {
        let response = undefined;
        let color: COLOR = COLOR.NONE;
        let place = -1;

        if (tokenid[0] == "R") {
            color = COLOR.RED;
        } else if (tokenid[0] == "B") {
            color = COLOR.BLUE;
        } else if (tokenid[0] == "Y") {
            color = COLOR.YELLOW;
        } else if (tokenid[0] == "G") {
            color = COLOR.GREEN;
        }

        if (this.tokenPresent) {
            if (this.tokenType == TOKENTYPE.SINGLE) {
                if (this.tokens.SINGLE.id == tokenid) {
                    response = this.tokens.SINGLE;
                    this.tokens.SINGLE = undefined;
                }
            } else {
                for (let i = 0; i < this.tokens.MULTIPLE[color].length; i++) {
                    if ((this.tokens.MULTIPLE[color])[i].id == tokenid) {
                        place = i;
                    }
                }
                if (place != -1) {
                    response = this.tokens.MULTIPLE[color].splice(place, 1);
                }
            }
        }

        // this.refactorTokenObject();
        return response;
    }

    /**
     * 
     * @param tokenid 
     * @param stepsToTake 
     * @param dual 
     * 
     * This function alters allowed token parameters to be changed, namely steps to take and dual mode.
     * Steps to take as arguement is the number to be decreased from it. 
     */
    editTokenData(tokenid: string, stepsToTake: undefined | number, dual: boolean = false) {
        if (this.tokenPresent) {
            if (this.tokenType == TOKENTYPE.SINGLE) {
                if (dual) {
                    (this.tokens.SINGLE).dual = true;
                } else {
                    (this.tokens.SINGLE).dual = false;
                }

                if (stepsToTake != undefined) {
                    (this.tokens.SINGLE).stepsToTake -= stepsToTake;
                }
            } else {

            }
        }
    }

    /**
     * 
     * @param color 
     * @returns 
     * 
     * This function returns whether a new dual can be formed at this position for a given color. If yes, then it will
     * return true, along with the concerned token. Else will return false with token undefined.
     */
    dualPossibility(color: COLOR): any {
        let response: any = {
            possibility: false,
            token: undefined
        };

        let t = this.getAllTokenInfo(color);
        if (t.length && this.type != TILETYPE.SAVETILE && this.type != TILETYPE.HOMEPATH) {
            for (let tk of t) {
                if (!tk.dual) {
                    response = {
                        possiblity: true,
                        token: tk
                    }
                    return response;
                }
            }
        }

        return response;
    }
    /* Define relevant functions later */
}
