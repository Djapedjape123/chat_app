const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const socket = require("socket.io");

const server = http.createServer(app);
const io = new socket.Server(server);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const users = {};

io.on("connection", (socket) => {

    socket.on("load", (arg) => {
        console.log("TEST");
        io.emit("onlineUsers", users);
    });

    socket.on("register", (args) => {
        console.log(args);
        console.log(socket.id);
        users[socket.id] = {
            name: args
        };
        io.emit("onlineUsers", users);
        console.log(users);
    });

    socket.on("send_message", (message) => {
        console.log({message, "socketID": socket.id});
        io.emit("send_message", {message, user: users[socket.id].name});
    });

});

server.listen(3001, () => {
    console.log("Server running");
});

//pocinjemo 2