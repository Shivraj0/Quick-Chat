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

exports.getUser = (userID) => {
    var user = {};

    userDB.findOne({id: userID}, (err, userObj) => {
        err ? console.log('Cannot find the user with the given userID...') : user = userObj;
        console.log(user);
        return;
    });

    return user;
};