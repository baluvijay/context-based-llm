import { dirToVector, createPrompt } from './vector/vector.js';
import { queryOllama } from './ollama/ollama.js';
import {createInterface} from 'readline';
async function executePrompt(userQuery) {
    try {
        
        console.log('🔍 [INFO] Generating prompt...');
        const {prompt,sourceFiles} = await createPrompt(userQuery);
        
        console.log('🤖 [INFO] Querying Ollama...');
        const response = await queryOllama(prompt);

        console.log('💡 [RESULT] Ollama Response:', response);
        return {response,sourceFiles};
    } catch (error) {
        console.error('❌ [ERROR] Execution failed:', error);
    }
    
}

async function main() {
    try {
        console.log('🚀 [START] Initializing Vector Processing...');
        await dirToVector();
        console.log('✅ [SUCCESS] Vector processing completed.\n');

        // Create readline interface
        const readline = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log('\n=== 📝 Terminal Query Interface ===');
        console.log('🔍 Type your queries about the processed files.');
        console.log('💡 Type "exit" to quit.\n');

        // Function to handle user queries
        const askQuestion = () => {
            readline.question('🟢 Query: ', async (query) => {
                if (query.toLowerCase() === 'exit') {
                    console.log('👋 Exiting query interface.');
                    readline.close();
                    return;
                }

                try {
                    console.log('\n⏳ Processing query...');
                    const {response,sourceFiles} = await executePrompt(query);

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
    } catch (error) {
        console.error('❌ [ERROR] Execution failed:', error);
    }
}
// Run the main function
main();