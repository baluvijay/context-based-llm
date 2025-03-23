import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-coder:6.7b';
const OLLAMA_API = process.env.OLLAMA_API || 'http://localhost:11434/api/generate';

// Function to query Ollama
async function queryOllama(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        console.error('❌ Error: queryOllama requires a valid prompt string.');
        return;
    }

    try {
        const response = await axios.post(OLLAMA_API, {
            model: OLLAMA_MODEL,
            prompt: prompt,
            stream: false
        });
        return response.data;
    } catch (error) {
        console.error('❌ Error querying Ollama:', error.message);
    }
}

export {queryOllama}