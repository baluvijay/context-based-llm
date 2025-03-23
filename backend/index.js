import { dirToVector, createPrompt } from './vector/vector.js';
import { queryOllama } from './ollama/ollama.js';
import express from 'express';
import cors from 'cors';
import { createInterface } from 'readline';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const INTERFACE_MODE = process.env.INTERFACE_MODE || 'terminal'; // 'terminal' or 'api'
const PORT = process.env.PORT || 3000;

async function executePrompt(userQuery) {
    try {
        console.log('🔍 [INFO] Generating prompt...');
        const {prompt,sourceFiles} = await createPrompt(userQuery);
        
        console.log('🤖 [INFO] Querying Ollama...');
        const response = await queryOllama(prompt);
        return {response,sourceFiles};
    } catch (error) {
        console.error('❌ [ERROR] Execution failed:', error);
        throw error;
    }
}

async function startApiServer() {
    const app = express();

    // Middleware to parse JSON bodies
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:8080'
      }));

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    // Query endpoint
    app.post('/query', async (req, res) => {
        try {
            const { query } = req.body;
            
            if (!query) {
                return res.status(400).json({ 
                    error: 'Query parameter is required' 
                });
            }

            console.log('\n⏳ Processing query:', query);
            const {response, sourceFiles} = await executePrompt(query);
            console.log('Response Received');

            res.json({
                response: response.response,
                sourceFiles: sourceFiles
            });
        } catch (error) {
            console.error('❌ Error processing query:', error);
            res.status(500).json({ 
                error: 'Failed to process query',
                details: error.message 
            });
        }
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
        console.log('📝 Send POST requests to /query with a JSON body containing your query');
        console.log('Example: { "query": "your question here" }');
    });
}

async function startTerminalInterface() {
    const readline = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\n=== 📝 Terminal Query Interface ===');
    console.log('🔍 Type your queries about the processed files.');
    console.log('💡 Type "exit" to quit.\n');

    const askQuestion = () => {
        readline.question('🟢 Query: ', async (query) => {
            if (query.toLowerCase() === 'exit') {
                console.log('👋 Exiting query interface.');
                readline.close();
                return;
            }

            try {
                console.log('\n⏳ Processing query...');
                const {response, sourceFiles} = await executePrompt(query);
                
                console.log('\n--- 🤖 LLM Response ---');
                console.log(response.response);

                console.log('\n--- 📂 Source Files ---');
                console.log(sourceFiles.join('\n'));

                console.log('\n✅ Search completed.\n');
            } catch (error) {
                console.error('❌ Error during query:', error);
            }

            askQuestion(); // Recursively ask for the next query
        });
    };

    askQuestion();
}

async function main() {
    try {
        console.log('🚀 [START] Initializing Vector Processing...');
        await dirToVector();
        console.log('✅ [SUCCESS] Vector processing completed.\n');

        // Start the appropriate interface based on environment variable
        if (INTERFACE_MODE.toLowerCase() === 'api') {
            console.log('📡 Starting API server mode...');
            await startApiServer();
        } else {
            console.log('💻 Starting terminal interface mode...');
            await startTerminalInterface();
        }

    } catch (error) {
        console.error('❌ [ERROR] Initialization failed:', error);
        process.exit(1);
    }
}

// Run the main function
main();