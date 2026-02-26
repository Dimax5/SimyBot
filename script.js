function sendMessage(event) {
    event.preventDefault();
    
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    
    const userMessage = messageInput.value.trim();
    
    if (!userMessage) {
        return;
    }
    
    // Aggiungi il messaggio dell'utente
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.innerHTML = `
        <div class="message-content">
            <p>${escapeHtml(userMessage)}</p>
        </div>
    `;
    chatMessages.appendChild(userMessageDiv);
    
    // Pulisci l'input
    messageInput.value = '';
    messageInput.focus();
    
    // Scorri il chat in fondo
    scrollToBottom();
    
    // Simula un piccolo delay prima della risposta del bot
    setTimeout(() => {
        addBotMessage();
    }, 300);
}

function addBotMessage() {
    const chatMessages = document.getElementById('chatMessages');
    
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'message bot-message';
    botMessageDiv.innerHTML = `
        <div class="message-content">
            <p>non ho capito</p>
        </div>
    `;
    chatMessages.appendChild(botMessageDiv);
    
    // Scorri il chat in fondo
    scrollToBottom();
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
