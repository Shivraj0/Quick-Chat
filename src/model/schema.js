const mongoose = require('mongoose');

const users = mongoose.Schema({
    id: {
        type: String
    },
    username: {
        type: String
    },
    room: {
        type: String
    }
});

module.exports = mongoose.model('myUsers', users, 'users')