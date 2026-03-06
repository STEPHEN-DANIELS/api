async function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            
            if (message) {
                // 1. Show the user's message immediately
                addMessage(message, 'user');
                input.value = '';
                
                // Optional: Show typing indicator here while waiting
                
                try {
                    // 2. Send the message to YOUR backend server
                    // Replace 'http://localhost:3000/chat' with your actual backend URL once deployed
                    const response = await fetch('http://localhost:3000/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ message: message })
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    
                    // 3. Display the response from ChatGPT (via your backend)
                    addMessage(data.reply, 'developer');

                } catch (error) {
                    console.error('Error:', error);
                    addMessage("Sorry, I'm having trouble connecting right now.", 'developer');
                }
            }
        }
