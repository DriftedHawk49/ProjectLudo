global.roomStatus = {};
global.allRooms = {};
global.players = {};
const app = require("express")();
const httpServer = require("http").createServer(app);
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const Player = require("./player/player.controller");
const roomController = require("./room/room.controller");
const options = {
    cors: {
        origin: "http://localhost:4200"
    }
};
const io = require("socket.io")(httpServer, options);
const PORT = 5000 | process.env.PORT;

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    const userid = socket.handshake.auth.userid;
    socket.data.username = username;
    socket.data.userid = userid;
    next();
});

io.on("connection", (socket) => {
    Player.newJoining(socket);

    socket.on("CREATE_ROOM", (data) => {
        roomController.createNewRoom(socket, data.roomname);
    });

    socket.on("JOIN_ROOM", (data) => {
        roomController.joinRoom(io, socket, data.roomid);
    });

    socket.on("GAME_MODE_CHANGE", (mode) => {
        global.allRooms[socket.data.roomid].gametype = mode;
        io.in(socket.data.roomid).emit("GAME_MODE_CHANGED", mode);
    });

    socket.on("LOCK_STATUS_CHANGE", (status) => {
        global.allRooms[socket.data.roomid].locked = status;
        io.in(socket.data.roomid).emit("LOCK_STATUS_CHANGED", status);
        if (!status && global.allRooms[socket.data.roomid].players.length < 4) {
            socket.in("IDLE_PLAYERS").emit("ROOM_UNLOCKED", {
                roomname: global.allRooms[socket.data.roomid].roomname,
                roomid: socket.data.roomid,
                noOfPlayers: global.allRooms[socket.data.roomid].players.length
            });
        } else {
            socket.in("IDLE_PLAYERS").emit("ROOM_LOCKED", socket.data.roomid);
        }
    });

    socket.on("SEND_OPEN_ROOMS", () => {
        let payload = [];

        for (let roomid in global.allRooms) {
            if (!global.allRooms[roomid].locked && global.allRooms[roomid].players.length < 4) {
                let temp = {
                    roomname: global.allRooms[roomid].roomname,
                    roomid: roomid,
                    noOfPlayers: global.allRooms[roomid].players.length
                }
                payload.push(temp);
            }
        }

        socket.emit("OPEN_ROOMS", payload);
    });

    socket.on("GET_IDLE_PLAYERS", () => {
        if (io.sockets.adapter.rooms.has("IDLE_PLAYERS")) {
            let idlePlayers = io.sockets.adapter.rooms.get("IDLE_PLAYERS");
            let payload = [];
            for (let sockid of idlePlayers) {
                let sockit = io.sockets.sockets.get(sockid);
                let temp = {
                    username: sockit.data.username,
                    userid: sockit.data.userid
                }
                payload.push(temp);
            }

            socket.emit("IDLE_PLAYERS_LIST", payload);
        } else {
            socket.emit("IDLE_PLAYERS_LIST", []);

        }

    });

    socket.on("INVITE_PLAYER", (userid) => {

        if (global.players[userid] != undefined) {
            const sockid = global.players[userid];
            let payload = {
                sendername: socket.data.username,
                roomid: socket.data.roomid,
                roomname: global.allRooms[socket.data.roomid].roomname,
                noOfPlayers: global.allRooms[socket.data.roomid].players.length,
            };
            console.error("INVITE SENT");
            socket.in(sockid).emit("INVITATION", payload)
        }
    });

    socket.on("SEND_TEXT", (payload) => {
        io.in(socket.data.roomid).emit("NEW_CHAT", payload);
    })

    socket.on("START_GAME", () => {
        global.allRooms[socket.data.roomid].roomtype = 2;
        let roominfo = global.allRooms[socket.data.roomid];
        io.in(socket.data.roomid).emit("GAME_STARTED", roominfo);
    });

    socket.on("DICE_THROW", (diceNumber) => {
        io.in(socket.data.roomid).emit("DICE_THROWN", diceNumber);
    });

    socket.on("UPDATE_RANK", (payload) => {
        console.log("RANK_UPDATED");
        for (let p of payload) {
            for (let i = 0; i < global.allRooms[socket.data.roomid].players.length; i++) {
                if (p.userid == global.allRooms[socket.data.roomid].players[i].userid) {
                    global.allRooms[socket.data.roomid].players[i].rank = p.rank;
                    break;
                }
            }
        }
    });

    socket.on("RETAIN_TURN", () => {
        io.in(socket.data.roomid).emit("TURN_RETAINED");
    })

    socket.on("CHANGE_TURN", (turn) => {
        let i = 0;
        let rankers = 0;
        for (let pl of global.allRooms[socket.data.roomid].players) {
            if (pl.color == turn) {
                break;
            } else {
                i++;
            }
        }

        if (i >= global.allRooms[socket.data.roomid].players.length - 1) {
            i = 0;
        } else {
            i++;
        }



        for (let p of global.allRooms[socket.data.roomid].players) {
            if (p.rank != -1) {
                rankers++;
            }
        }

        if (rankers == global.allRooms[socket.data.roomid].players.length - 1) {
            for (let j = 0; j < global.allRooms[socket.data.roomid].players.length; j++) {
                if (global.allRooms[socket.data.roomid].players[j].rank == -1) {
                    global.allRooms[socket.data.roomid].players[j].rank = rankers + 1;
                    break;
                }
            }
            global.allRooms[socket.data.roomid].roomtype = 3;
            io.in(socket.data.roomid).emit("GAME_OVER");
        } else {

            while (1) {
                if (global.allRooms[socket.data.roomid].players[i].rank == -1) {
                    break;
                }
                if (i >= global.allRooms[socket.data.roomid].players.length - 1) {
                    i = 0;
                } else {
                    i++;
                }
            }

            io.in(socket.data.roomid).emit("TURN_CHANGED", global.allRooms[socket.data.roomid].players[i].color);
        }


    });

    socket.on("TILE_CLICK", (position) => {
        io.in(socket.data.roomid).emit("TILE_CLICKED", position);
    });

    socket.on("STOP_TIMER", () => {
        io.in(socket.data.roomid).emit("TIMER_STOPPED");
    });

    socket.on("MULTI_TOKEN_MOVEMENT", (payload) => {
        io.in(socket.data.roomid).emit("MULTI_TOKEN_MOVED", payload);
    });

    socket.on("ENTER_WAITING_AREA", () => {
        global.allRooms[socket.data.roomid].roomtype = 1;
    });

    socket.on("ROOM_DETAILS", () => {
        let col = [2,3,4];
        for(let i = 0; i<global.allRooms[socket.data.roomid].players; i++){
            if(global.allRooms[socket.data.roomid].players[i].host){
                global.allRooms[socket.data.roomid].players[i].color = 1;
            }else{
                global.allRooms[socket.data.roomid].players[i].color = col.pop();
            }
        }
        let payload = {
            roomname: global[socket.data.roomid].roomname,
            roomid: socket.data.roomid,
            players: global[socket.data.roomid].players
        }

        socket.emit("RESTART", payload);
    });

    socket.on("MUTE_CHANGE", (data)=>{
        io.in(socket.data.roomid).emit("MUTE_CHANGED", data);
    })

    socket.on("disconnect", (reason) => {
        console.log(reason);
        console.log("PLAYER DISCONNECTED");
        const roomid = socket.data.roomid;
        delete global.players[socket.data.userid];
        if (socket.data.roomid != undefined) {
            if (global.allRooms[roomid] != undefined) {
                if (global.allRooms[roomid].roomtype == 1) {
                    if (socket.data.host) {
                        if (io.sockets.adapter.rooms.has(roomid)) {

                            io.in(roomid).emit("HOST_DISCONNECTED");
                            if (io.sockets.adapter.rooms.has(roomid)) {
                                for (let sockid of io.sockets.adapter.rooms.get(roomid)) {
                                    (io.sockets.sockets.get(sockid)).data.roomid = undefined;
                                    (io.sockets.sockets.get(sockid)).data.host = undefined;

                                    (io.sockets.sockets.get(sockid)).join("IDLE_PLAYERS");
                                    (io.sockets.sockets.get(sockid)).leave(roomid);
                                }
                            }
                        }
                        delete global.allRooms[roomid];
                    } else {

                        let j = -1;
                        for (let i = 0; i < global.allRooms[socket.data.roomid].players.length; i++) {
                            if (global.allRooms[socket.data.roomid].players[i].userid == socket.data.userid) {
                                j = i;
                                break;
                            }
                        }
                        global.allRooms[socket.data.roomid].players.splice(j, 1);
                        let package = {
                            toRemove: socket.data.userid,
                            players: []
                        };
                        for (let i = 0; i < global.allRooms[socket.data.roomid].players.length; i++) {
                            global.allRooms[socket.data.roomid].players[i].color = i + 1;
                            let p = {
                                userid: global.allRooms[socket.data.roomid].players[i].userid,
                                color: global.allRooms[socket.data.roomid].players[i].color
                            }
                            package.players.push(p);
                        }

                        io.in(socket.data.roomid).emit("PLAYER_LEFT", package);
                    }
                } else if (global.allRooms[roomid].roomtype == 2 || global.allRooms[roomid].roomtype == 3) {

                    if (io.sockets.adapter.rooms.has(roomid) && io.sockets.adapter.rooms.get(roomid).size == 1) {
                        console.log("single player left");
                        if (io.sockets.adapter.rooms.has(roomid)) {
                            for (let sockid of io.sockets.adapter.rooms.get(roomid)) {
                                (io.sockets.sockets.get(sockid)).data.roomid = undefined;
                                (io.sockets.sockets.get(sockid)).data.host = undefined;
                                (io.sockets.sockets.get(sockid)).emit("EVERYONE_LEFT");

                                (io.sockets.sockets.get(sockid)).join("IDLE_PLAYERS");
                                (io.sockets.sockets.get(sockid)).leave(roomid);
                            }
                        }
                        delete global.allRooms[roomid];
                    } else {
                        if (socket.data.host) {
                            if (io.sockets.adapter.rooms.has(roomid)) {
                                let newHost = "";
                                let toRemove = -1;
                                for (let sockid of io.sockets.adapter.rooms.get(roomid)) {
                                    (io.sockets.sockets.get(sockid)).data.host = true;
                                    newHost = (io.sockets.sockets.get(sockid)).data.userid;
                                    break;
                                }
                                for (let i = 0; i < global.allRooms[socket.data.roomid].players.length; i++) {
                                    if (socket.data.userid == global.allRooms[socket.data.roomid].players[i].userid) {
                                        toRemove = i;
                                    }
                                    if (global.allRooms[socket.data.roomid].players[i].userid == newHost) {
                                        global.allRooms[socket.data.roomid].players[i].host = true;
                                    }
                                }

                                global.allRooms[socket.data.roomid].players.splice(toRemove, 1);
                                io.in(roomid).emit("HOST_CHANGED", {
                                    newHost: newHost,
                                    disconnected: socket.data.userid
                                });
                            }
                        } else {
                            let toRemove = -1;
                            for (let i = 0; i < global.allRooms[socket.data.roomid].players.length; i++) {
                                if (socket.data.userid == global.allRooms[socket.data.roomid].players[i].userid) {
                                    toRemove = i;
                                    break;
                                }
                            }
                            global.allRooms[socket.data.roomid].players.splice(toRemove, 1);
                            io.in(socket.data.roomid).emit("INGAME_PLAYER_LEFT", socket.data.userid);
                        }
                    }
                }
            }
        } else {
            io.in("HOSTS").emit("IDLE_LEFT", socket.data.userid);
        }
    });

});


httpServer.on("listening", () => {
    console.log("Server started on ", PORT);
});

httpServer.listen(PORT);