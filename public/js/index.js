const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const {username, room} = Qs.parse(location.search, {
    // To ignore query symbols.
    ignoreQueryPrefix: true
});

const socket = io();

// User name and room info socket
socket.emit('joinRoom', {username, room});

// Listening to messages from server.
socket.on('messageChannel', (message) => {
    displayMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll down when new message is received.
});

// User Message on Form Submit.
chatForm.addEventListener('submit', (event) => {
    
    // To avoid default action on submit i.e page refresh.
    event.preventDefault();

    const userInputElement = event.target.elements.msg
    const userMessage = userInputElement.value;
    
    // Send user message to server.
    socket.emit('userMsgChannel', userMessage);

    // Clear message input box once it is sent to the server.
    userInputElement.value = '';
    userInputElement.focus();
});

const displayMessage = (userMessage) => {
    const newElement = document.createElement('div');
    newElement.classList.add('message');
    newElement.innerHTML = `<p class="meta">${userMessage.userName}&nbsp;<span>${userMessage.time}</span></p>
    <p class="text">
        ${userMessage.userMessage}
    </p>`
    document.querySelector('.chat-messages').appendChild(newElement);
}