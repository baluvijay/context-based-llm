console.log('hello');
import dotenv from 'dotenv';
dotenv.config();
import { ChromaClient } from 'chromadb';
import path from 'path';  // No need to destructure
import fs from 'fs-extra'; // No need to destructure
import { pipeline } from '@xenova/transformers';
import { glob } from 'glob';

// Configuration constants
const COLLECTION_NAME = 'codebase-vectors';
const CODE_DIR = process.env.DIRECTORY_PATH; 
const FILE_FORMATS = process.env.FILE_FORMATS || '{js,ts,jsx,tsx,pdf}';
const CHUNK_SIZE = 1500; // Characters per chunk
const CHUNK_OVERLAP = 500; // Character overlap between chunks
const VECTOR_DB_MODEL = 'Xenova/all-MiniLM-L6-v2';

console.log(CODE_DIR);

/**
 * Splits text into overlapping chunks
 * @param {string} text - The text to chunk
 * @param {number} chunkSize - Size of each chunk in characters
 * @param {number} overlap - Overlap between chunks in characters
 * @returns {string[]} Array of text chunks
 */
function chunkText(text, chunkSize, overlap) {
    const chunks = [];
    let index = 0;
    
    while (index < text.length) {
      const chunk = text.substring(index, index + chunkSize);
      chunks.push(chunk);
      index += (chunkSize - overlap);
    }
    
    return chunks;
}

/**
 * Processes directory of code files and stores in vector database
 */
async function dirToVector() {
    const client = new ChromaClient();
    console.log('Setting up the chroma collection');
    
    // Initialize embedding model
    const embedder = await pipeline('feature-extraction', VECTOR_DB_MODEL);
    const embeddingFunction = {
      generate: async (texts) => {
        const embeddings = [];
        for (const text of texts) {
          const output = await embedder(text, { pooling: 'mean', normalize: true });
          embeddings.push(Array.from(output.data));
        }
        return embeddings;
      }
    };
    
    // Get or create collection
    let collection;
    try {
        collection = await client.getCollection({
          name: COLLECTION_NAME, 
          embeddingFunction: embeddingFunction
        });
        console.log('Using existing collection');
    } catch (e) {
        collection = await client.createCollection({
          name: COLLECTION_NAME, 
          embeddingFunction: embeddingFunction
        });
        console.log('Created new collection');
    }
    
    console.log('Finding files..');
    const files = glob.sync(`${CODE_DIR}/**/*.${FILE_FORMATS}`);
    console.log(`Found ${files.length} to process`);

    let counter = 0;
    for (const file of files) {
        try {
            const relativePath = path.relative(CODE_DIR, file);
            const content = await fs.readFile(file, 'utf8');

            if (!content.trim()) {
                console.log(`Skipping empty file ${file}`);
                continue;
            }
            
            const chunks = chunkText(content, CHUNK_SIZE, CHUNK_OVERLAP);

            for (let i = 0; i < chunks.length; i++) {
                const chunkId = `${relativePath}-chunks${i}`;
                await collection.add({
                    ids: [chunkId],
                    metadatas: [{ 
                      text: chunks[i], 
                      file: relativePath, 
                      chunkIndex: i, 
                      totalChunks: chunks.length,
                      language: path.extname(file).substring(1)
                    }],
                    documents: [chunks[i]]
                });
            }
            
            console.log(`Processed file No ${counter} , filename:  ${file}`);
            counter = counter + 1;
        }
        catch (e) {
            console.log(`Error processing file ${file} `);
            console.log(`Error is ${e} `);
        }
    }
}

/**
 * Creates a prompt for querying the codebase with an LLM
 * @param {string} query - The search query
 * @param {number} maxResults - Maximum number of results to include
 * @returns {string} Formatted prompt with context
 */
async function createPrompt(query, maxResults = 5) {
    console.log(`Searching codebase for: "${query}"`);
  
    // Step 1: Retrieve relevant code chunks
    const client = new ChromaClient();
    const embedder = await pipeline('feature-extraction', VECTOR_DB_MODEL);
    
    const embeddingFunction = {
        generate: async (texts) => {
            const embeddings = [];
            for (const text of texts) {
                const output = await embedder(text, { pooling: 'mean', normalize: true });
                embeddings.push(Array.from(output.data));
            }
            return embeddings;
        }
    };
    
    const collection = await client.getCollection({
        name: COLLECTION_NAME, 
        embeddingFunction: embeddingFunction
    });
    
    // Query the collection
    const results = await collection.query({
        queryTexts: [query],
        nResults: maxResults,
    });
    
    // Step 2: Format the context for the LLM
    let context = '';
    const metadatas = results.metadatas[0] || [];
    const documents = results.documents[0] || [];
    
    for (let i = 0; i < metadatas.length; i++) {
        const metadata = metadatas[i];
        const document = documents[i];
        
        context += `\n--- Code from ${metadata.file} ---\n${document}\n`;
    }
    
    // Step 3: Create a prompt for the LLM
    const prompt = `You are a helpful assistant analyzing a codebase. 
Below are relevant code snippets from the codebase related to the query: "${query}"

${context}

Based on these code snippets, please answer the following query:
${query}

Provide a comprehensive response, focusing on the specific code shown above. 
If code examples would help, include them.`;

    return {prompt,sourceFiles:metadatas.map(m => m.file)};
}

export { dirToVector, createPrompt };