const uniqid = require("uniqid");

module.exports = {
    createNewRoom: function (socket, roomname) {
        const roomid = uniqid.time();
        global.allRooms[roomid] = {
            roomname: roomname,
            roomtype: 1,
            gametype: 2,
            locked: true,
            players: [{
                username: socket.data.username,
                userid: socket.data.userid,
                color: 1,
                rank: -1,
                host: true
            }]
        };
        socket.data.host = true;
        socket.data.roomid = roomid;
        socket.join("HOSTS");
        socket.join(roomid);
        socket.leave("IDLE_PLAYERS");
        socket.to("HOSTS").emit("IDLE_PLAYER_LEFT", { userid: socket.data.userid });
        socket.emit("NEW_ROOM", { roomname: roomname, roomid: roomid });
    },
    joinRoom: function (io, socket, roomid) {
        if (global.allRooms[roomid] == undefined || !io.sockets.adapter.rooms.has(roomid)) {
            socket.emit("JOIN_FAILED");
        } else {
            const noOfPlayers = io.sockets.adapter.rooms.get(roomid).size;
            console.log("ROOMSIZE : ", noOfPlayers);
            if (noOfPlayers < 4 && global.allRooms[roomid].roomtype==1) {
                socket.leave("IDLE_PLAYERS");
                socket.join(roomid);
                socket.data.host = false;
                socket.data.roomid = roomid;
                let col = -1
                if (noOfPlayers == 1) {
                    col = 2;
                } else if (noOfPlayers == 2) {
                    col = 3;
                } else {
                    col = 4;
                }
                socket.data.color = col;
                let p = {
                    username: socket.data.username,
                    userid: socket.data.userid,
                    color: col,
                    rank: -1,
                    host: false
                }

                global.allRooms[roomid].players.push(p);
                let package = global.allRooms[roomid];
                package.roomid = roomid;

                io.in("HOSTS").emit("IDLE_PLAYER_LEFT", { userid: socket.data.userid });
                socket.in(roomid).emit("SOMEONE_JOINED", {
                    username: socket.data.username,
                    userid: socket.data.userid,
                    color: col
                });
                socket.emit("JOIN_SUCCESS", package);
                
                if(io.sockets.adapter.rooms.get(roomid).size==4){
                    socket.in("IDLE_PLAYERS").emit("ROOM_LOCKED", roomid);
                }

            } else {
                socket.emit("JOIN_FAILED");
            }
        }

    }
}