import { io } from "socket.io-client";

let setupSocket = () => {
    socket = io.connect()
}

exports.setupSocket = setupSocket;