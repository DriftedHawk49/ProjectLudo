import { io } from "socket.io-client";

const URL = "https://projectludoserver.herokuapp.com";
const socket = io(URL, { autoConnect: false });

export default socket;