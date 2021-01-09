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
mongoose.Promise = global.Promise;
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
    
    // Join room
    socket.on('joinRoom', ({username, room}) => {
        
        socket.join(room);

        // Add user to DB.
        let user = controller.addUser(socket.id, username, room);

        // Connection success message to client.
        socket.emit('messageChannel', utility.FormatMessage(constants.QuickBot, 'Quick-Chat team welcomes you.!'));

        // broadcast new user join message in a room.
        let broadcastMessage = `${user.username} joined the room.`;
        socket.broadcast.to(user.room).emit('messageChannel', utility.FormatMessage(user.username, broadcastMessage));

        controller.findUsers()
            .then((users) => {
                io.to(user.room).emit('userRoom', {
                    room: user.room,
                    users: users
                });
            })
            .catch((err) => {

            });
    
    });

    // Socket to receive and send message back to client.
    socket.on('userMsgChannel', (userMessage) => {

        controller.getUser(socket.id)
            .then((user) => {
                io.to(user.room).emit('messageChannel', utility.FormatMessage(user.username, userMessage));
            })
            .catch((err) => {
                console.log('Some error occurred while sending messages... \n', err)
            });
    });

    // Leave room.
    socket.on('disconnect', () => {
        
        controller.getUser(socket.id)
            .then((user) => {
                console.log(user);
                io.to(user.room).emit('messageChannel', utility.FormatMessage(constants.QuickBot, `${user.username} left the room.`));

                // Remove user and send room info to client.
                controller.removeUser(socket.id)
                    .then(() => {
                        controller.findUsers()
                            .then((users) => {
                                io.to(user.room).emit('userRoom', {
                                    room: user.room,
                                    users: users
                                });
                            })
                            .catch((err) => {
                                console.log('Sever: Some error occurred while fetching users... \n',err);
                            });
                    })
                    .catch((err) => {
                        console.log('Server: Some error occurred while fetching users... \n', err);
                    });
            })
            .catch((err) => {
                console.log('Server: Some error occurred while leaving room... \n', err)
            });
    });

});

const port = config.PORT;

server.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
