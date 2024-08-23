//const API_KEY = ''

async function handleSubmit(event) {
    event.preventDefault();
    const appType = document.getElementById('appType').value;
    const features = Array.from(document.getElementById('features').selectedOptions).map(option => option.value);
    const targetAndroidVersion = document.getElementById('targetAndroidVersion').value;
    let prompt = `Generate Android app dependencies for a ${appType} app with the following features: ${features.join(', ')}. Target Android version: ${targetAndroidVersion}. Provide the dependencies in Gradle KOTLIN format.`;

    const additional_input = document.getElementById('additional info').value;
    if (additional_input !== null && additional_input.trim() !== '') {
        prompt += ` Here's some additional information about the app: ${additional_input}`;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
    const requestBody = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };
    console.log('Sending prompt:', prompt);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        // Extract only the response text
        let responseText = '';
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            responseText = data.candidates[0].content.parts[0].text || '';
        }

        // Format the response text
        const formattedText = formatResponse(responseText);

        // Display the formatted text
        document.getElementById('result').innerHTML = formattedText;
    } catch (error) {
        document.getElementById('result').textContent = 'Error: ' + error.message;
    }
}
// Retry logic function
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.ok) {
            return response;
        } else if (response.status === 429 && i < retries - 1) {
            await new Promise(res => setTimeout(res, delay)); // wait for the delay before retrying
            delay *= 2; // exponential backoff
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
}

function formatResponse(text) {
    // Handle escape characters
    text = text.replace(/\\n/g, '\n')
               .replace(/\\t/g, '\t')
               .replace(/\\"/g, '"')
               .replace(/\\'/g, "'");

    // Handle bold text (convert **text** to <strong>text</strong>)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert newlines to <br> tags for HTML display
    text = text.replace(/\n/g, '<br>');

    return text;
}

// Attach the handleSubmit function to the form
document.getElementById('dependencyForm').addEventListener('submit', handleSubmit);
