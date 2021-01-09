const userDB = require('../model/schema');

// Add user
exports.addUser = (userID, username, roomname) => {
    
    const user = {
        id: userID,
        username: username,
        room: roomname
    };

    const newuser = userDB(user);
    
    newuser.save((err, userObj) => {

        if(err) {
            console.log('Error adding user to the database...\n', err);            
        }

        if(userObj) {
            console.log(`${userObj.username} added to Database.!`);
        }

    });

    return user;
};

// Get user with given socket id.
exports.getUser = (userID) => {

    let user = userDB.findOne({id: userID})
        .then((userObj) => {
            return userObj;
        })
        .catch((err) => {
            console.log('Controller: Some error occurred while fetching... \n', err);
        });

    return user;
};

// Find all users.
exports.findUsers = () => { 
    
    let user = userDB.find()
        .then((userObj) => {
            return userObj;
        })
        .catch((err) => {
            console.log('Controller: Some error while fetching users... \n', err);
        });

    return user;
};

// Remove user with given socket id.
exports.removeUser = (userID) => {

    let user = userDB.findOneAndRemove({id: userID}, {useFindAndModify: false})
        .then(() => {
            console.log('Controller: User successfully removed.!');
        })
        .catch((err) => {
            console.log('Controller: Some error occurred while removing user... \n', err);
        });

    return user;
};
