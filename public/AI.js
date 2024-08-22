<<<<<<< HEAD
// Replace these with your actual API keys

// Function to handle form submission
require('dotenv').config();
async function handleSubmit(event) {
    event.preventDefault();
    const appType = document.getElementById('appType').value;
    const features = Array.from(document.getElementById('features').selectedOptions).map(option => option.value);
    const targetAndroidVersion = document.getElementById('targetAndroidVersion').value;
    const prompt = `Generate Android app dependencies for a ${appType} app with the following features: ${features.join(', ')}. Target Android version: ${targetAndroidVersion}. Provide the dependencies in Gradle format.`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.API_KEY}`;
    const requestBody = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };

    try {
        const response = await fetchWithRetry(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        
        // Extract the text content from the response
        let textContent = '';
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            textContent = data.candidates[0].content.parts[0].text || '';
        }
        
        // Format the text content, replacing \n with actual line breaks
        const formattedContent = textContent.replace(/\\n/g, '\n');
        
        // Display the formatted content
        document.getElementById('result').textContent = formattedContent;
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

// Attach the handleSubmit function to the form
document.getElementById('dependencyForm').addEventListener('submit', handleSubmit);
=======
// Replace these with your actual API keys

// Function to handle form submission
require('dotenv').config();
async function handleSubmit(event) {
    event.preventDefault();
    const appType = document.getElementById('appType').value;
    const features = Array.from(document.getElementById('features').selectedOptions).map(option => option.value);
    const targetAndroidVersion = document.getElementById('targetAndroidVersion').value;
    const prompt = `Generate Android app dependencies for a ${appType} app with the following features: ${features.join(', ')}. Target Android version: ${targetAndroidVersion}. Provide the dependencies in Gradle format.`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.API_KEY}`;
    const requestBody = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };

    try {
        const response = await fetchWithRetry(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        
        // Extract the text content from the response
        let textContent = '';
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            textContent = data.candidates[0].content.parts[0].text || '';
        }
        
        // Format the text content, replacing \n with actual line breaks
        const formattedContent = textContent.replace(/\\n/g, '\n');
        
        // Display the formatted content
        document.getElementById('result').textContent = formattedContent;
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

// Attach the handleSubmit function to the form
document.getElementById('dependencyForm').addEventListener('submit', handleSubmit);
>>>>>>> c11e08e407cdb3fee1412e59bda5c807b9945629
