const userDB = require('../model/schema');

exports.addUser = (userID, username, roomname) => {
    
    const user = {
        id: userID,
        username: username,
        room: roomname
    };

    const newUser = userDB(user);

    newUser.save((err, doc) => {
        err ? console.log('Error adding user to the database...\n', err) : console.log('User added to the Database.!')
        return;
    });

    return user;
};