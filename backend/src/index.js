const http = require("http");
const express = require("express");
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");
const { handleMessage, handleClose } = require("./roomService.js");

const PORT = process.env.PORT || 8080;
const STARTED_AT = new Date();

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.type("text/plain").send(`Running since ${STARTED_AT.toISOString()}`);
});

app.use((req, res) => {
  res.status(404).type("text/plain").send("Not Found");
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const uuid = uuidv4();
  console.log("New connection:", uuid);

  ws.on("close", () => handleClose(ws, uuid));

  ws.on("error", (e) => console.error("Error:", e));

  ws.on("message", (message) => {
    handleMessage(ws, uuid, message);
  });
});

server.listen(PORT, () => {
  console.log(`Running on port ${PORT}...`);
});

module.exports = { app, server, wss };
module.exports.app = app;
module.exports.server = server;
module.exports.wss = wss;
