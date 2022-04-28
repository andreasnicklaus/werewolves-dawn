import { WebSocketServer } from "ws";
import {v4 as uuidv4} from "uuid"
import {handleMessage, handleClose} from "./roomService.js";

const PORT =  8081

const wss = new WebSocketServer({port: PORT})

wss.on('connection', ws => {
    const uuid = uuidv4();
    console.log("New connection:", uuid)

    ws.on('close', () => handleClose(ws, uuid));

    ws.on('error', e => console.error("Error:", e));

    ws.on('message', message => {
        handleMessage(ws, uuid, message)
    });
})

console.log(`Running on port ${PORT}...`)