// Replace these with your actual API keys
const GEMINI_API_KEY = '';
const CHATGPT_API_KEY = 'your-chatgpt-api-key';
const CLAUDE_API_KEY = 'your-claude-api-key';

const form = document.getElementById('dependencyForm');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');

async function generateDependencies(apiType) {
    const appType = document.getElementById('appType').value;
    const features = document.getElementById('features').value;
    const androidVersion = document.getElementById('androidVersion').value;
    const additionalRequirements = document.getElementById('additionalRequirements').value;

    const prompt = `Generate the dependencies section of a build.gradle file for an Android app with the following requirements:
    - App Type: ${appType}
    - Features: ${features}
    - Target Android Version: ${androidVersion}
    - Additional Requirements: ${additionalRequirements}

    Please provide only the dependencies section, formatted as valid Gradle syntax.`;

    loadingDiv.style.display = 'block';
    resultDiv.textContent = '';

    try {
        let result;
        switch (apiType) {
            case 'gemini':
                result = await callGeminiAPI(prompt);
                break;
            case 'chatgpt':
                result = await callChatGPTAPI(prompt);
                break;
            case 'claude':
                result = await callClaudeAPI(prompt);
                break;
            default:
                throw new Error('Invalid API type');
        }
        resultDiv.textContent = result;
    } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
    } finally {
        loadingDiv.style.display = 'none';
    }
}

async function callGeminiAPI(prompt) {
    
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });
    
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected response format from Gemini API');
        }
    }
    //return new Promise(resolve => setTimeout(() => resolve('Gemini API response placeholder'), 1000));

    async function testGeminiAPI() {
        try {
            const result = await callGeminiAPI("Generate Android dependencies for a database-driven app using Room");
            console.log("Gemini API Response:", result);
            alert("Gemini API test completed. Check the console for results.");
        } catch (error) {
            console.error("Gemini API Error:", error);
            alert("Gemini API test failed. Check the console for error details.");
        }
    }
    
    // Add this line to test the Gemini API when the page loads
    window.addEventListener('load', testGeminiAPI);

async function callChatGPTAPI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHATGPT_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}]
        })
    });
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callClaudeAPI(prompt) {
    // Implement Claude API call here
    // This is a placeholder implementation
    return new Promise(resolve => setTimeout(() => resolve('Claude API response placeholder'), 1000));
}

document.getElementById('geminiBtn').addEventListener('click', () => generateDependencies('gemini'));
document.getElementById('chatgptBtn').addEventListener('click', () => generateDependencies('chatgpt'));
document.getElementById('claudeBtn').addEventListener('click', () => generateDependencies('claude'));
