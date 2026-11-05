const { v4: uuidv4 } = require("uuid");
const { WereWolfGame } = require("./werewolf-game.js");

let rooms = {};
const connections = new Map(); // connId -> { roomCode, playerId }

const RECONNECT_GRACE_MS = 60000;

function getPlayerId(connId) {
  return connections.get(connId)?.playerId || null;
}

function getRoomCodeForPlayer(playerId) {
  for (const code of Object.keys(rooms)) {
    if (rooms[code].players && rooms[code].players[playerId]) return code;
  }
  return null;
}

function getRoom(roomCode) {
  return rooms[roomCode];
}

function leaveRoom(roomCode, playerId) {
  if (!roomCode || !rooms[roomCode]) return;
  const room = rooms[roomCode];
  if (!room.players || !room.players[playerId]) return;

  if (room.disconnectTimers && room.disconnectTimers[playerId]) {
    clearTimeout(room.disconnectTimers[playerId]);
    delete room.disconnectTimers[playerId];
  }

  delete room.players[playerId];
  room.game.deletePlayer(playerId);

  if (Object.keys(room.players).length === 0) {
    clearTimeout(room.timeout);
    delete rooms[roomCode];
  }
}

function broadCastMessage(roomCode, data) {
  const room = rooms[roomCode];
  if (!room || !room.players) return;
  Object.entries(room.players).forEach(([key, entry]) => {
    if (!entry || !entry.socket) return;
    try {
      entry.socket.send(JSON.stringify({ roomCode, ...data }));
    } catch (e) {
      console.error("Broadcast send failed:", e);
    }
  });
}

function broadCastPlayerInfo(roomCode) {
  const room = rooms[roomCode];
  if (!room || !room.players) return;
  Object.entries(room.players).forEach(([key, entry]) => {
    if (!entry || !entry.socket) return;
    try {
      entry.socket.send(
        JSON.stringify({ roomCode, ...room.game.getPrivateInfo(key) }),
      );
    } catch (e) {
      console.error("Broadcast player info failed:", e);
    }
  });
}

function broadCastRoundFinishMessage(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;
  const winnerFriendly = room.game.getWinner();

  Object.entries(room.players).forEach(([key, entry]) => {
    if (!entry || !entry.socket) return;
    try {
      entry.socket.send(
        JSON.stringify({
          type: "winnerDetermined",
          roundId: room.game.roundId,
          winnerFriendly,
          roleAfterTheRound: room.game.getRoleAfterTheRound(key),
        }),
      );
    } catch (e) {
      console.error("Broadcast round finish failed:", e);
    }
  });
}

function sendNextPlayerMessages(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;
  room.isAdvancing = true;
  let nextUUIDs = room.game.nextPlayers();
  const roundId = room.game.roundId;
  room.isAdvancing = false;
  if (nextUUIDs) {
    broadCastMessage(roomCode, {
      type: "NextPlayer",
      roundId,
    });
    for (const nextUUID of nextUUIDs) {
      const entry = room.players[nextUUID];
      if (entry && entry.socket) {
        try {
          entry.socket.send(
            JSON.stringify({
              type: "YourTurn",
              roundId,
            }),
          );
        } catch (e) {
          console.error("Send YourTurn failed:", e);
        }
      }
    }
    if (room.timeout) {
      clearTimeout(room.timeout);
      delete room.timeout;
    }
    room.currentTurnPlayerIds = nextUUIDs;
    room.timeout = setTimeout(() => {
      const currentRoom = rooms[roomCode];
      if (!currentRoom || currentRoom.isAdvancing) return;
      currentRoom.isAdvancing = true;
      currentRoom.currentTurnPlayerIds = null;
      if (currentRoom.timeout) {
        clearTimeout(currentRoom.timeout);
        delete currentRoom.timeout;
      }
      sendNextPlayerMessages(roomCode);
    }, room.game.waitTime * nextUUIDs.length);
  } else {
    broadCastMessage(roomCode, {
      type: "RoundEnd",
      roundId,
    });
    room.currentTurnPlayerIds = null;
    room.game.currentPlayerIndex = null;
    if (room.timeout) {
      clearTimeout(room.timeout);
      delete room.timeout;
    }
  }
}

function checkTurnCompletion(roomCode) {
  const room = rooms[roomCode];
  if (!room || !room.currentTurnPlayerIds || room.isAdvancing) return;
  const allDone = room.currentTurnPlayerIds.every((uuid) => {
    const player = room.game.getPlayerWithUUID(uuid);
    return !!player && player.actionPerfomed === true;
  });
  if (!allDone) return;
  room.isAdvancing = true;
  room.currentTurnPlayerIds = null;
  if (room.timeout) {
    clearTimeout(room.timeout);
    delete room.timeout;
  }
  sendNextPlayerMessages(roomCode);
}

function markDisconnected(roomCode, playerId) {
  const room = rooms[roomCode];
  if (!room || !room.players || !room.players[playerId]) return;

  room.players[playerId].connected = false;
  room.players[playerId].socket = null;

  if (room.currentTurnPlayerIds && room.currentTurnPlayerIds.includes(playerId)) {
    room.game.markTurnComplete(playerId);
    checkTurnCompletion(roomCode);
  }

  if (room.disconnectTimers[playerId]) {
    clearTimeout(room.disconnectTimers[playerId]);
  }

  room.disconnectTimers[playerId] = setTimeout(() => {
    const currentRoom = rooms[roomCode];
    if (!currentRoom || !currentRoom.players || !currentRoom.players[playerId]) {
      return;
    }
    if (currentRoom.players[playerId].connected) return;

    for (const [cid, info] of connections.entries()) {
      if (info.playerId === playerId && info.roomCode === roomCode) connections.delete(cid);
    }
    leaveRoom(roomCode, playerId);
    broadCastMessage(roomCode, { type: "playerDisconnected", playerId });
  }, RECONNECT_GRACE_MS);
}

function reclaimPlayer(roomCode, playerId, socket, connId, name) {
  const room = rooms[roomCode];
  if (!room || !room.players || !room.players[playerId]) return false;

  const existing = room.players[playerId];
  if (existing.connId && existing.connId !== connId && existing.socket && existing.socket !== socket) {
    try {
      existing.socket.close(4000, "replaced");
    } catch (e) {
      console.error("Close replaced socket failed:", e);
    }
  }

  if (room.disconnectTimers && room.disconnectTimers[playerId]) {
    clearTimeout(room.disconnectTimers[playerId]);
    delete room.disconnectTimers[playerId];
  }

  room.players[playerId] = {
    socket,
    connId,
    name: name || existing.name,
    connected: true,
  };

  if (name && room.game && typeof room.game.getPlayerWithUUID === "function") {
    const player = room.game.getPlayerWithUUID(playerId);
    if (player) player.name = name;
  }

  connections.set(connId, { roomCode, playerId });

  try {
    socket.send(
      JSON.stringify({ roomCode, ...room.game.getPrivateInfo(playerId) }),
    );
  } catch (e) {
    console.error("Send reclaimed state failed:", e);
  }

  broadCastPlayerInfo(roomCode);
  return true;
}

function addPlayer(roomCode, playerId, socket, connId, name) {
  const room = rooms[roomCode];
  room.game.addPlayer({ uuid: playerId, name });
  room.players[playerId] = {
    socket,
    connId,
    name,
    connected: true,
  };
  connections.set(connId, { roomCode, playerId });

  try {
    socket.send(
      JSON.stringify({ roomCode, ...room.game.getPrivateInfo(playerId) }),
    );
  } catch (e) {
    console.error("Send new player state failed:", e);
  }
}

module.exports.handleMessage = function (socket, connId, data) {
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    console.error("Invalid message:", e);
    return;
  }
  data = parsed;

  console.log("Received message", data);

  let {
    meta,
    name,
    roles,
    voteFor,
    roomCode,
    selectedPlayerUUID,
    selectedIndex,
    left,
    playerId: providedPlayerId,
  } = data;

  if (!roomCode) {
    const knownPlayerId = getPlayerId(connId);
    if (knownPlayerId) roomCode = getRoomCodeForPlayer(knownPlayerId);
  }

  if (meta === "join" || meta === "rejoin") {
    const playerId = providedPlayerId || uuidv4();

    if (roomCode && rooms[roomCode] && rooms[roomCode].players && rooms[roomCode].players[playerId]) {
      reclaimPlayer(roomCode, playerId, socket, connId, name);
      return;
    }

    if (!roomCode || !rooms[roomCode]) {
      roomCode = uuidv4().substring(0, 6);
      rooms[roomCode] = {
        game: new WereWolfGame(),
        players: {},
        disconnectTimers: {},
      };
    }

    addPlayer(roomCode, playerId, socket, connId, name);
    broadCastPlayerInfo(roomCode);
    return;
  }

  const playerId = getPlayerId(connId);
  if (!playerId) {
    try {
      socket.send(JSON.stringify({ type: "rejoinFailed" }));
    } catch (e) {}
    return;
  }

  if (!roomCode) roomCode = getRoomCodeForPlayer(playerId);
  if (!roomCode || !rooms[roomCode]) {
    try {
      socket.send(JSON.stringify({ type: "rejoinFailed" }));
    } catch (e) {}
    return;
  }

  const room = rooms[roomCode];

  if (meta === "leave") {
    leaveRoom(roomCode, playerId);
    connections.delete(connId);
    return;
  } else if (meta === "startGame") {
    if (room.timeout) {
      clearTimeout(room.timeout);
      delete room.timeout;
    }
    room.currentTurnPlayerIds = null;
    room.isAdvancing = false;
    room.game.startGame();
    broadCastMessage(roomCode, { type: "gameStart", roundId: room.game.roundId });
    room.timeout = setTimeout(() => {
      sendNextPlayerMessages(roomCode);
    }, room.game.waitTime);
  } else if (meta === "setupRoles") {
    room.game.setRoles(roles);
  } else if (meta === "voteGiven") {
    room.game.vote(playerId, voteFor);
    if (room.game.allPlayersVoted()) {
      broadCastRoundFinishMessage(roomCode);
    }
  } else if (meta === "wardenAction") {
    room.game.wardenMove(playerId, selectedPlayerUUID);
  } else if (meta === "uncoverMiddleCard") {
    const uncoveredRole = room.game.uncoverMiddleRole(
      playerId,
      selectedIndex,
    );
    const entry = room.players[playerId];
    if (entry && entry.socket) {
      entry.socket.send(
        JSON.stringify({
          type: "UncoveredCard",
          roundId: room.game.roundId,
          uncoveredRole,
        }),
      );
    }
  } else if (meta === "alphaWolfAction") {
    room.game.alphaWolfMove(playerId, selectedPlayerUUID);
  } else if (meta === "seeingWolfAction") {
    const uncoveredRole = room.game.seeingWolfMove(
      playerId,
      selectedPlayerUUID,
    );
    const entry = room.players[playerId];
    if (entry && entry.socket) {
      entry.socket.send(
        JSON.stringify({
          type: "UncoveredCard",
          roundId: room.game.roundId,
          uncoveredRole,
        }),
      );
    }
  } else if (meta === "ghostBusterAction") {
    const uncoveredRole = room.game.ghostBusterMove(
      playerId,
      selectedPlayerUUID,
    );
    const entry = room.players[playerId];
    if (entry && entry.socket) {
      entry.socket.send(
        JSON.stringify({
          type: "UncoveredCard",
          roundId: room.game.roundId,
          uncoveredRole,
        }),
      );
    }
  } else if (meta === "witchAction") {
    room.game.witchMove(playerId, selectedIndex, selectedPlayerUUID);
  } else if (meta === "idiotAction") {
    room.game.idiotMove(playerId, left);
  } else if (meta === "fortuneTellerAction") {
    room.game.fortuneTellerMove(playerId);
    const playersWithActions = room.game.getPlayersWithActions(playerId);
    console.log("playersWithActions", playersWithActions);
    const entry = room.players[playerId];
    if (entry && entry.socket) {
      entry.socket.send(
        JSON.stringify({
          type: "actionPlayers",
          roundId: room.game.roundId,
          playersWithActions,
        }),
      );
    }
  } else if (meta === "scoutAction") {
    room.game.scoutMove(playerId, selectedIndex);
  } else if (meta === "turnComplete") {
    room.game.markTurnComplete(playerId);
  }

  if (roomCode) {
    checkTurnCompletion(roomCode);
    broadCastPlayerInfo(roomCode);
  }
};

module.exports.handleClose = function (socket, connId) {
  const info = connections.get(connId);
  if (!info) return;

  const { roomCode, playerId } = info;
  connections.delete(connId);

  const room = rooms[roomCode];
  if (!room || !room.players || !room.players[playerId]) return;
  if (room.players[playerId].connId !== connId) {
    connections.delete(connId);
    return;
  }

  markDisconnected(roomCode, playerId);
};

module.exports.leaveRoom = leaveRoom;
module.exports.getRoomCode = getRoomCodeForPlayer;