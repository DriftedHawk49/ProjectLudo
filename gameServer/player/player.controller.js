module.exports = {
    newJoining : function(socket){
        /* 
            Add new players to idlePlayers room, 
            Add new player to player database.
            inform hosts about arrival of new players.
        */
       console.log(socket.data);
        global.players[socket.data.userid] = socket.id;
        socket.data.host = false;        

        socket.join("IDLE_PLAYERS");
        socket.to("HOSTS").emit("NEW_JOINING", {username: socket.data.username, userid: socket.data.userid});
        socket.emit("CONNECTION_SUCCESSFUL");
    }
}