function sendMessage(event) {
    event.preventDefault();
    
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Messaggio utente
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.innerHTML = `
        <div class="message-content">
            <p>${escapeHtml(userMessage)}</p>
        </div>
    `;
    chatMessages.appendChild(userMessageDiv);

    messageInput.value = '';
    messageInput.focus();
    scrollToBottom();

    setTimeout(async () => {
        const botResponse = await generateResponse(userMessage);
        addBotMessage(botResponse);
    }, 400);
}

async function generateResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();

    // Saluti
    if (/^(ciao|salve|ehi|hey|buongiorno|buonasera)/.test(message)) {
        return "Ciao! Come posso aiutarti? 😊";
    }

    // Chi sei
    if (/chi sei|cosa sei/.test(message)) {
        return "Sono SimyBot, il tuo assistente virtuale intelligente 🤖";
    }

    // Ringraziamenti
    if (/grazie|thx/.test(message)) {
        return "Di nulla! È un piacere aiutarti!";
    }

    // Ora
    if (/che ora/.test(message)) {
        const now = new Date();
        return `Adesso sono le ${now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Data
    if (/che giorno|che data|oggi/.test(message)) {
        const now = new Date();
        return `Oggi è ${now.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    }

    // 🔎 Ricerca online (DuckDuckGo)
    const searchResult = await searchOnline(userMessage);
    if (searchResult) {
        return searchResult;
    }

    return "Interessante! Puoi spiegarti meglio?";
}

async function searchOnline(query) {
    try {
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Abstract && data.Abstract.trim().length > 0) {
            return data.Abstract.length > 350 
                ? data.Abstract.substring(0, 350) + "..." 
                : data.Abstract;
        }

        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            const first = data.RelatedTopics[0];
            if (first.Text) {
                return first.Text.length > 300
                    ? first.Text.substring(0, 300) + "..."
                    : first.Text;
            }
        }

        return null;
    } catch (error) {
        console.log("Errore ricerca:", error);
        return null;
    }
}

function addBotMessage(response) {
    const chatMessages = document.getElementById('chatMessages');

    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'message bot-message';
    botMessageDiv.innerHTML = `
        <div class="message-content">
            <p>${escapeHtml(response)}</p>
        </div>
    `;
    chatMessages.appendChild(botMessageDiv);

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