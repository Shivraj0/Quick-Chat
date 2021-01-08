const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMsg = require('./utils/formatMessage');

const app = express();
const server = http.createServer(app); // New http server variable.
const io = socketio(server);

// Static Resources
app.use(express.static(path.join(__dirname, 'public')));

const quickBot = 'QuickChat bot'

io.on('connection', socket => {
    
    socket.on('joinRoom', ({userName, roomName}) => {

    });
    // Connection success message to client.
    socket.emit('messageChannel', formatMsg(quickBot, 'Quick-Chat team welcomes you.!'));

    socket.broadcast.emit('messageChannel', 'A New user poped in chat.');

    socket.on('disconnect', () => {
        io.emit('messageChannel', 'A user poped out of chat.')
    });

    socket.on('userMsgChannel', (userMessage) => {
        // Sending message back to client once received.
        io.emit('messageChannel', formatMsg('User', userMessage));
    });
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});