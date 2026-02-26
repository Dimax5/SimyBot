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
    setTimeout(async () => {
        const botResponse = await generateResponse(userMessage);
        addBotMessage(botResponse);
    }, 300);
}

async function generateResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Saluti
    if (/^(ciao|ola|salve|ehi|hey|buongiorno|buonasera|buenos?|moin)(\s|!|\?|$)/.test(message)) {
        const greetings = [
            "Ciao! Come posso aiutarti?",
            "Salve! Che cosa desideri?",
            "Ehi! Sono qui per te!",
            "Buongiorno! Come stai?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Domande su chi sei
    if (/^(chi sei|chi\s+sei\?|cosa sei|cosa\s+sei\?|cosa\s+fai)/.test(message)) {
        return "Sono SimyBot, un assistente virtuale qui per aiutarti! 🤖";
    }
    
    // Ringraziamenti
    if (/^(grazie|thx|grazie mille|molto gentile|apprezzo)(\s|!|\?|$)/.test(message)) {
        return "Di nulla! Sono sempre felice di aiutare! 😊";
    }
    
    // Domande su come stai
    if (/^(come|come\s+stai|come\s+va|come\s+vieni|tutto\s+bene)/.test(message)) {
        const responses = [
            "Sto bene, grazie per aver chiesto! E tu?",
            "Perfetto! Grazie della domanda! Come stai tu?",
            "Tutto a posto! E con te, come va?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Domande Yes/No con "?"
    if (message.endsWith('?')) {
        // Domande sull'orario
        if (/^(che ore|che\s+ora|qual[\s\']?è\s+l[\'a]ora|che\s+tempo)/.test(message)) {
            const now = new Date();
            return `Adesso sono le ${now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        // Domande sulla data
        if (/^(che\s+giorno|qual[\s\']?è\s+la\s+data|quant[\']?è|oggi)/.test(message)) {
            const now = new Date();
            return `Oggi è il ${now.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
        }
        
        // Estrai una parola chiave dalla domanda e cerca su Google tramite DuckDuckGo
        const keywords = message.replace(/^(chi|cosa|come|dove|quando|quale|quanto|quali|quantf|è|che|ecco)\s+/gi, '').replace(/\?/g, '').trim();
        
        if (keywords.length > 2) {
            try {
                const response = await searchGoogle(keywords);
                if (response) {
                    return response;
                }
            } catch (error) {
                console.log("Errore nella ricerca:", error);
            }
        }
        
        // Fallback per domande generiche con ?
        const questionResponses = [
            "Interessante domanda! Potrebbe essere così...",
            "Buona osservazione! Esattamente quello che stavo pensando!",
            "Dipende dal contesto, ma generalmente sì!",
            "Non sono completamente sicuro, ma probabilmente!"
        ];
        return questionResponses[Math.floor(Math.random() * questionResponses.length)];
    }
    
    // Affermazioni positive
    if (/(bene|buono|ottimo|fantastico|bellissimo|grandioso|eccellente)(\s|!|$)/.test(message)) {
        return "Sono d'accordo! È davvero fantastico! 🎉";
    }
    
    // Affermazioni negative
    if (/(male|brutto|orribile|terribile|pessimo|noioso)(\s|!|$)/.test(message)) {
        return "Mi dispiace sentirlo. Spero che le cose migliorino presto! 💪";
    }
    
    // Feedback
    if (/^(ok|va bene|d[\']?accordo|perfetto|esatto|vero)(\s|!|$)/.test(message)) {
        return "Fantastico! Sono contento che siamo sulla stessa lunghezza d'onda! ✨";
    }
    
    // Fallback per messaggi non riconosciuti
    return "Interessante! Puoi dirmi di più al riguardo?";
}

async function searchGoogle(query) {
    try {
        // Usa DuckDuckGo Instant Answer API (simile a Google, gratuita, no autenticazione)
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Se DuckDuckGo ha una risposta diretta (Abstract)
        if (data.Abstract && data.Abstract.trim().length > 0) {
            const answer = data.Abstract.length > 350 ? data.Abstract.substring(0, 350) + "..." : data.Abstract;
            return answer;
        }
        
        // Altrimenti cerca nei risultati
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            const firstResult = data.RelatedTopics[0];
            if (firstResult.Text) {
                const text = firstResult.Text.length > 300 ? firstResult.Text.substring(0, 300) + "..." : firstResult.Text;
                return text;
            }
        }
        
        return null;
    } catch (error) {
        console.log("Errore nella ricerca Google:", error);
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
