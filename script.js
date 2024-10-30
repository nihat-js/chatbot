let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
const chatElement = document.getElementById('chat');


function saveChatHistory() {
    if (chatHistory.length == 0) {
        chatElement.style.display = "none" ;
    } else {
        chatElement.style.display = "block"
    }
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    chatHistory.forEach(message => {
        chatElement.innerHTML += `<div class="chat-message ${message.role}">${message.role === 'user' ? 'You' : 'AI'}: ${message.text}</div>`;
    });
    chatElement.scrollTop = chatElement.scrollHeight;
    if (chatHistory.length == 0) {
        chatElement.style.display = "none"
    }
}

loadChatHistory();


document.getElementById('newChatButton').addEventListener('click', function () {
    chatHistory = [];
    chatElement.innerHTML = '';
    saveChatHistory()
});


document.getElementsByTagName("input")[0].onkeydown = function (e) {
    if (e.key == "Enter") {
        console.log("gelorem")
        getResponse()
    }
}

document.getElementById('sendButton').addEventListener('click', getResponse)
async function getResponse() {
    const userInput = document.getElementById('userInput').value;
    const chatElement = document.getElementById('chat');
    const loader = document.getElementById('loader');

    chatElement.innerHTML += `<div class="chat-message user">You: ${userInput}</div>`;
    chatElement.scrollTop = chatElement.scrollHeight; // Scroll to bottom

    document.getElementById('userInput').value = '';

    chatHistory.push({ text: userInput, role: 'user' });

    saveChatHistory(); // Save after each input


    loader.style.display = 'block';

    // Call AI21 API
    try {
        const response = await fetch('https://api.ai21.com/studio/v1/j2-ultra/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer jNuDxuGsMxvxzPPehysZRIUTL6Nhmmeb' // Replace with your AI21 API key
            },
            body: JSON.stringify({
                numResults: 1,
                temperature: 0.7,
                messages: chatHistory,
                system: "You are an AI assistant for business research. Your responses should be informative and concise."
            })
        });

        const data = await response.json();

        // Hide loader after receiving response
        loader.style.display = 'none';

        if (data && data.outputs && data.outputs.length > 0) {
            const botResponse = data.outputs[0].text.trim();
            chatElement.innerHTML += `<div class="chat-message bot">AI: ${botResponse}</div>`;
            chatElement.scrollTop = chatElement.scrollHeight; // Scroll to bottom


            // Update chat history with bot response
            chatHistory.push({ text: botResponse, role: 'assistant' });
            saveChatHistory(); // Save after receiving response
        } else {
            chatElement.innerHTML += `<div class="chat-message bot">AI: No response available.</div>`;
        }

    } catch (error) {
        console.error('Error:', error);
        loader.style.display = 'none'; // Hide loader on error
        chatElement.innerHTML += `<div class="chat-message bot">AI: Error fetching the response.</div>`;
    }
}

