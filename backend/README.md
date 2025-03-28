# **Context Based LocalLLM** 
A **local-first** implementation of LLM-based analysis using **ChromaDB** and **Ollama**.This project offers a powerful solution for managing and querying any kind of file, making it easier to explore and understand your data. By utilizing a locally running Large Language Model (LLM), it enables you to search and analyze files efficiently, without needing an internet connection or relying on external servers.

One of the major benefits of this approach is the assurance of privacy. When using external LLM services, there’s always a concern that your sensitive information could be exposed or misused. However, with this system, everything runs locally on your own machine, ensuring that your data remains private and secure. You no longer have to worry about sharing sensitive files with third-party services.

This solution allows you to take full advantage of advanced AI capabilities to search, explore, and understand your files—whether they’re documents, spreadsheets, or any other type of data—while keeping your information completely under your control. You can easily navigate through large collections of files or find specific details, all while maintaining your privacy and security.

## **Features** ✨  
✅ **Local indexing** of the provided files using ChromaDB  
✅ **Ask questionse** regarding the provided files using a powerful LLM model  
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
Go into the backend folder
Create a .env file in the root directory and set the following variables, sample env file given
Copy the folder with all the files you want to add as a context into the data folder.
Ollama model deepseek-coder is trained keeping the coding context in mind, feel free to use anyother model.
If the file format you want to add isnt included , just add the file format into the env variable FILE_FORMATS
```sh
DIRECTORY_PATH='../data'  # Folder containing files to be processed
OLLAMA_MODEL='deepseek-coder:6.7b' # Change this to your preferred model
OLLAMA_API='http://localhost:11434/api/generate' # Ollama API endpoint
FILE_FORMATS='{js,ts,jsx,tsx,pdf,csv,txt}' 
INTERFACE_MODE="" # api/terminal
```

### **4️⃣ NPM Command**
Use node version 20.10.0 for the code to run seamlessly, follow the below commands for the same 
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
2. **Optimize vector classification** – Instead of indexing the entire set of files everytime, try to use a diff checker.  
3. **Experiment with fine-tuning the model** – If the provided files wont change rapidly,explore training/fine tuning the model with that context to recognize patterns and styles more effectively.
4. **Add agents support** – Instead of providing the files locally, you can use agent tool to get the data. Probably using LangChain
5. **Create a bash script** to make the setup smoother
     

💡 **Have suggestions or want to contribute?** Feel free to reach out!  








