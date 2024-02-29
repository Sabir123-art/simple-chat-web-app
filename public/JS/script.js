
const socket = io();
socket.on('chat message', data => {
  const messageDiv = document.createElement('div');
  messageDiv.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
  document.getElementById('chat-box').appendChild(messageDiv);
});

document.getElementById('chat-form').addEventListener('submit', e => {
  e.preventDefault();
  const message = document.getElementById('message-input').value.trim();
  if (message !== '') {
    socket.emit('chat message', message);
    document.getElementById('message-input').value = '';
  }
});
