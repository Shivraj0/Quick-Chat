const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

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
    newElement.innerHTML = `<p class="meta">Mary <span>9:15pm</span></p>
    <p class="text">
        ${userMessage}
    </p>`
    document.querySelector('.chat-messages').appendChild(newElement);
}