import { v4 as uuidv4 } from "uuid";
import { WereWolfGame } from "./werewolf-game.js";

let rooms = {}

function getRoomCode(uuid_given) {
    for (let code of Object.keys(rooms)) {
        for (let uuid of Object.keys(rooms[code])) {
            if (uuid === uuid_given) return code
        }
    }

    return null
}

function leaveRoom(roomCode, uuid) {
    if (!rooms[roomCode]) return
    if (!rooms[roomCode][uuid]) return
    if (Object.keys(rooms[roomCode]).length === 1) {
        clearTimeout(rooms[roomCode].timeout)
        delete rooms[roomCode]
    } else {
        delete rooms[roomCode][uuid]
        rooms[roomCode].game.deletePlayer(uuid)
    }
}

function broadCastMessage(roomCode, data) {
    Object.entries(rooms[roomCode]).forEach(([key, { socket }]) => {
        if (key === "game" || key === "timeout") return;
        socket.send(JSON.stringify({ roomCode, ...data }));
    });
}

function broadCastPlayerInfo(roomCode) {
    Object.entries(rooms[roomCode]).forEach(([key, { socket }]) => {
        if (key === "game" || key === "timeout") return;
        socket.send(JSON.stringify({ roomCode, ...rooms[roomCode].game.getPrivateInfo(key) }))
    })
}

function broadCastRoundFinishMessage(roomCode) {
    const winnerFriendly = rooms[roomCode].game.getWinner()

    Object.entries(rooms[roomCode]).forEach(([key, { socket }]) => {
        if (key === "game" || key === "timeout") return;
        socket.send(JSON.stringify({
            type: "winnerDetermined",
            winnerFriendly,
            roleAfterTheRound: rooms[roomCode].game.getRoleAfterTheRound(key)
        }))
    })
}

function sendNextPlayerMessages(roomCode) {
    let nextUUIDs = rooms[roomCode].game.nextPlayers()
    if (nextUUIDs) {
        broadCastMessage(roomCode, {
            type: "NextPlayer"
        })
        for (const nextUUID of nextUUIDs) {
            rooms[roomCode][nextUUID].socket.send(JSON.stringify({
                type: "YourTurn"
            }))
        }
        rooms[roomCode].timeout = setTimeout(() => {
            sendNextPlayerMessages(roomCode)
        }, rooms[roomCode].game.waitTime * nextUUIDs.length)
    } else {
        broadCastMessage(roomCode, {
            type: "RoundEnd"
        })
        rooms[roomCode].game.currentPlayerIndex = null
    }
}

export function handleMessage(socket, uuid, data) {
    data = JSON.parse(data)
    console.log("Received message", data)

    let { meta, name, roles, voteFor, roomCode, selectedPlayerUUID, selectedIndex, left } = data;
    if (!roomCode) roomCode = getRoomCode(uuid);

    if (meta === "join") {
        if (!roomCode || !rooms[roomCode]) {
            roomCode = uuidv4()
            rooms[roomCode] = { game: new WereWolfGame() }
        }

        rooms[roomCode].game.addPlayer({ uuid, name })
        rooms[roomCode][uuid] = { socket: socket }
    } else if (meta === "leave") {
        leaveRoom(roomCode, uuid)
    } else if (meta === "startGame") {
        rooms[roomCode].game.startGame()
        broadCastMessage(roomCode, { type: "gameStart" })
        rooms[roomCode].timeout = setTimeout(() => {
            sendNextPlayerMessages(roomCode)
        }, rooms[roomCode].game.waitTime)
    } else if (meta === "setupRoles") {
        rooms[roomCode].game.setRoles(roles)
    } else if (meta === "voteGiven") {
        rooms[roomCode].game.vote(uuid, voteFor)
        if (rooms[roomCode].game.allPlayersVoted()) {
            broadCastRoundFinishMessage(roomCode)
        }
    } else if (meta === "wardenAction") {
        rooms[roomCode].game.wardenMove(uuid, selectedPlayerUUID)
    } else if (meta === "uncoverMiddleCard") {
        const uncoveredRole = rooms[roomCode].game.uncoverMiddleRole(uuid, selectedIndex)
        rooms[roomCode][uuid].socket.send(JSON.stringify({
            type: "UncoveredCard",
            uncoveredRole
        }))
    } else if (meta === "alphaWolfAction") {
        rooms[roomCode].game.alphaWolfMove(uuid, selectedPlayerUUID)
    } else if (meta === "seeingWolfAction") {
        const uncoveredRole = rooms[roomCode].game.seeingWolfMove(uuid, selectedPlayerUUID)
        rooms[roomCode][uuid].socket.send(JSON.stringify({
            type: "UncoveredCard",
            uncoveredRole
        }))
    } else if (meta === "ghostBusterAction") {
        const uncoveredRole = rooms[roomCode].game.ghostBusterMove(uuid, selectedPlayerUUID)
        rooms[roomCode][uuid].socket.send(JSON.stringify({
            type: "UncoveredCard",
            uncoveredRole
        }))
    } else if (meta === "witchAction") {
        rooms[roomCode].game.witchMove(uuid, selectedIndex, selectedPlayerUUID)
    } else if (meta === "idiotAction") {
        rooms[roomCode].game.idiotMove(uuid, left)
    } else if (meta === "fortuneTellerAction") {
        const playersWithActions = rooms[roomCode].game.getPlayersWithActions(uuid)
        console.log("playersWithActions", playersWithActions)
        rooms[roomCode][uuid].socket.send(JSON.stringify({
            type: "actionPlayers",
            playersWithActions
        }))
    } else if (meta === "scoutAction") {
        rooms[roomCode].game.scoutMove(uuid, selectedIndex)
    }

    if (roomCode) broadCastPlayerInfo(roomCode)
}

export function handleClose(socket, uuid) {
    const roomCode = getRoomCode(uuid);
    leaveRoom(roomCode, uuid)
}