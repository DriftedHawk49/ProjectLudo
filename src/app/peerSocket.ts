import { io } from "socket.io-client";

const URL = "https://peerbrokerserver.herokuapp.com";
const peerSocket = io(URL, { autoConnect: false });

export default peerSocket;