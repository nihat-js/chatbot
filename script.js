let chatHistory = [
    // {
    //     text: "I'm crafting a market analysis tool for fintech leaders. How should I initiate the process?",
    //     role: "user"
    // },
    // {
    //     text: "1. Identify the target audience: Clearly define the fintech leaders who will benefit from the analysis tool. Consider factors such as industry, company size, and job function.\n2. Define the purpose of the tool: Define the key objectives of the market analysis tool, such as identifying market trends, assessing competition, or evaluating potential new markets.\n3. Determine the data sources: Identify the data sources that will be used to generate the analysis, such as market research reports, industry publications, and financial data.\n4. Design the user interface: Determine the layout of the user interface, including the types of charts and graphs that should be included, and the placement of key information.\n5. Test and refine the tool: Conduct user testing to ensure that the tool is easy to use and provides valuable insights. Make any necessary adjustments based on feedback.",
    //     role: "assistant"
    // },
    // {
    //     text: "Can you elaborate on the second item?",
    //     role: "user"
    // }
];

document.getElementById('sendButton').addEventListener('click', async function() {
    const userInput = document.getElementById('userInput').value;
    const chatElement = document.getElementById('chat');

    // Display user message
    chatElement.innerHTML += `<div class="chat-message user">You: ${userInput}</div>`;
    chatElement.scrollTop = chatElement.scrollHeight; // Scroll to bottom

    // Clear input
    document.getElementById('userInput').value = '';

    // Add user input to chat history
    chatHistory.push({ text: userInput, role: 'user' });

    // Call AI21 API
    try {
        const response = await fetch('https://api.ai21.com/studio/v1/j2-ultra/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer jNuDxuGsMxvxzPPehysZRIUTL6Nhmmeb'  // Replace with your AI21 API key
            },
            body: JSON.stringify({
                numResults: 1,
                temperature: 0.7,
                messages: chatHistory,
                system: "You are an AI assistant for business research. Your responses should be informative and concise."
            })
        });

        const data = await response.json();

        if (data && data.outputs && data.outputs.length > 0) {
            const botResponse = data.outputs[0].text.trim();
            chatElement.innerHTML += `<div class="chat-message bot">AI: ${botResponse}</div>`;
            chatElement.scrollTop = chatElement.scrollHeight; // Scroll to bottom

            // Update chat history with bot response
            chatHistory.push({ text: botResponse, role: 'assistant' });
        } else {
            chatElement.innerHTML += `<div class="chat-message bot">AI: No response available.</div>`;
        }

    } catch (error) {
        console.error('Error:', error);
        chatElement.innerHTML += `<div class="chat-message bot">AI: Error fetching the response.</div>`;
    }
});
