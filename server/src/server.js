const express = require('express');
const socket = require('socket.io');
const http = require('http');

const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.set('port', port);

const players = {};
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('new player', () => {
       players[socket.id] = {
           x: 0,
           y: 0
       }
    });
    socket.on('movement', (data) => {
        let player = players[socket.id] || {};
        player.x = data.horizontal;
        player.y= data.vertical;
    })

    socket.on('disconnected', () => {
       delete players[socket.id];
       io.emit('update-players', players);
    });
});

setInterval(()=>{
    io.sockets.emit('state', players)
}, 1000/60);

server.listen(port, () => {
    console.log(`Server is running on port 4000`);
});


