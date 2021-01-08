const moment = require('moment');

exports.FormatMessage = (userName, userMessage) => {
    return {
        userName,
        userMessage,
        time: moment().format('h:mm a')
    }
};
