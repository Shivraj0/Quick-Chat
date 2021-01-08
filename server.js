const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

// config variables.
const config = require('./src/config/config');

// Local Utilities.
const constants = require('./utils/constants');
const utility = require('./utils/utils');

// DB operation methods.
const controller = require('./src/controller/controller');

const app = express();

const server = http.createServer(app); // http server variable.

// Static Resources
app.use(express.static(path.join(__dirname, 'public')));

// Database 
mongoose.connect(config.dbURL, {   
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Database connected.!');
    })
    .catch((err) => {
        console.log('Error connecting to database...', err)
    });

const io = socketio(server);

// Socket communcation channel.
io.on('connection', socket => {
    
    socket.on('joinRoom', ({username, room}) => {
        const user = controller.addUser(socket.id, username, room);
        socket.join(user.room);

        // Connection success message to client.
        socket.emit('messageChannel', utility.FormatMessage(constants.QuickBot, 'Quick-Chat team welcomes you.!'));

        // broadcast new user join message in a room.
        let broadcastMessage = `${user.username} joined ${user.room} room.`;
        socket.broadcast.emit('messageChannel', utility.FormatMessage('test', broadcastMessage));
    });

    socket.on('disconnect', () => {
        io.emit('messageChannel', 'A user poped out of chat.')
    });

    // Socket to receive and send message back to client.
    socket.on('userMsgChannel', (userMessage) => {        
        io.emit('messageChannel', FormatMessage('User', userMessage));
    });
});

const port = config.PORT;

server.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
