const moment = require('moment');

const formatMessage = (userName, userMessage) => {
    return {
        userName,
        userMessage,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;