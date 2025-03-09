# **Context Based LocalLLM** 
A **local-first** implementation of LLM-based code analysis using **ChromaDB** and **Ollama**. This project allows you to index your codebase and query it efficiently using a locally running LLM model.  
It effectively kills the privacy concerns we all face when passing sensitive information  to a third party LLM server.Since everything is run in your local , you can freely use the power of LLM to navigate through your sensitive data as well.

## **Features** ✨  
✅ **Local codebase indexing** using ChromaDB  
✅ **Query your codebase** using a powerful LLM model  
✅ **No cloud dependency** – Runs entirely on your machine  
✅ **Customizable** – Configure the LLM model, API endpoint, and file formats  

---

## **Setup Instructions** ⚡  

### **1️⃣ Run ChromaDB Locally**
Start a **ChromaDB instance** using Docker:  
```sh
docker run -p 8000:8000 ghcr.io/chroma-core/chroma:latest
```
### **2️⃣ Run Ollama Locally**
You can follow this guide to set up ollama and run a local LLM : https://medium.com/@baluvijayakumar98/llms-on-your-local-machine-using-ollama-e6a011f8b158

### **3️⃣ Configure Environment Variables**
Create a .env file in the root directory and set the following variables 
```sh
DIRECTORY_PATH='./<your-folder>'  # Folder containing files to be processed
OLLAMA_MODEL='deepseek-coder:6.7b' # Change this to your preferred model
OLLAMA_API='http://localhost:11434/api/generate' # Ollama API endpoint
FILE_FORMATS='{js,ts,jsx,tsx,pdf}'  # File types to process
```

### **4️⃣ NPM Command**
Use node version 20.10.0, and then to install all the packages run the command 
```sh
npm install -g npm@20.10.0 # if not installed
nvm use 20.10.0 # to switch the versions
npm install
```

### **5️⃣ Start the Application**
To start the application got to the root and run the command
```sh
node index.js
```

## **Usage** 🛠️  

Once the application is running:  

1. **Your codebase will be indexed** using **ChromaDB**.  
2. A **terminal-based query interface** will launch.  
3. You can ask questions about your codebase
4. The model will return an LLM-generated response along with source file references.
5.Type "exit" to quit the interface.


## **Things to Do** 🛠️  

1. **Create a GUI** for the chat application instead of using the terminal.  
2. **Optimize vector classification** – Instead of running the entire codebase each time, detect changes and process only the modified files.  
3. **Experiment with fine-tuning the model** – If the model is static, explore training it with context to recognize coding patterns and architectural styles.  

💡 **Have suggestions or want to contribute?** Feel free to reach out!  








