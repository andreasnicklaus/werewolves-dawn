import {v4 as uuidv4} from "uuid";
import {WereWolfGame} from "./werewolf-game.js";
let rooms = {}

function getRoomCode(uuid_given) {
    for (let code of Object.keys(rooms)) {
        for (let uuid of Object.keys(rooms[code])) {
            if (uuid === uuid_given) return code
        }
    }

    return null
}

function broadCastMessage(roomCode, data) {
    Object.entries(rooms[roomCode]).forEach(([key, {socket}]) => {
        if (key === "game") return;
        socket.send(JSON.stringify(data));
    });
}

function broadCastPlayerInfo(roomCode) {
    Object.entries(rooms[roomCode]).forEach(([key, {socket}]) => {
        if (key === "game") return;
        socket.send(JSON.stringify(rooms[roomCode].game.getPrivateInfo(key)))
    })
}

export function handleMessage(socket, uuid, data) {
    data = JSON.parse(data)
    console.log("Received message", data)

    let {meta, name, roles, voteFor} = data;
    let roomCode = getRoomCode(uuid);

    if (meta === "join") {
        if (!roomCode) {
            roomCode = uuidv4()
            rooms[roomCode] = {game: new WereWolfGame()}
        }

        rooms[roomCode].game.addPlayer({uuid, name})
        rooms[roomCode][uuid] = {socket: socket}
    } else if (meta === "leave") {
        if (!rooms[roomCode]) return
        if (!rooms[roomCode][uuid]) return
        if (Object.keys(rooms[roomCode]).length === 1) delete rooms[roomCode]
        else {
            delete rooms[roomCode][uuid]
            rooms[roomCode].game.deletePlayer(uuid)
        }
    } else if (meta === "startGame") {
        rooms[roomCode].game.startGame()
    } else if (meta === "setupRoles") {
        rooms[roomCode].game.setRoles(roles)
    } else if (meta === "voteGiven") {
        rooms[roomCode].game.vote(uuid, voteFor)
        if (rooms[roomCode].game.allPlayersVoted()) {
            broadCastMessage(roomCode, {type: "winnerDetermined", winnerFriendly: rooms[roomCode].game.getWinner()})
        }
    }

    if (roomCode) broadCastPlayerInfo(roomCode)
}