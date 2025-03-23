# **Context Based LocalLLM** 
A **local-first** implementation of LLM-based analysis using **ChromaDB** and **Ollama**.This project offers a powerful solution for managing and querying any kind of file, making it easier to explore and understand your data. By utilizing a locally running Large Language Model (LLM), it enables you to search and analyze files efficiently, without needing an internet connection or relying on external servers.

One of the major benefits of this approach is the assurance of privacy. When using external LLM services, there’s always a concern that your sensitive information could be exposed or misused. However, with this system, everything runs locally on your own machine, ensuring that your data remains private and secure. You no longer have to worry about sharing sensitive files with third-party services.

This solution allows you to take full advantage of advanced AI capabilities to search, explore, and understand your files—whether they’re documents, spreadsheets, or any other type of data—while keeping your information completely under your control. You can easily navigate through large collections of files or find specific details, all while maintaining your privacy and security.

## **Features** ✨  
✅ **Local indexing** of the provided files using ChromaDB  
✅ **Ask questionse** regarding the provided files using a powerful LLM model  
✅ **No cloud dependency** – Runs entirely on your machine  
✅ **Customizable** – Configure the LLM model, API endpoint, and file formats  
✅ **UI interface** – easy to use front-end UI chat interface
✅ **Seperation** – both front-end & backend pods can be run seperately .


---

## **Setup Instructions** ⚡  

### **1️⃣ Run ChromaDB Locally**
Start a **ChromaDB instance** using Docker:  
```sh
docker run -p 8000:8000 ghcr.io/chroma-core/chroma:latest
```
### **2️⃣ Run Ollama Locally**
You can follow this guide to set up ollama and run a local LLM : https://medium.com/@baluvijayakumar98/llms-on-your-local-machine-using-ollama-e6a011f8b158
If you are using any model other than `deepseek-coder:6.7b` , please change the OLLAMA_MODEL in the .env file in backend folder

### **3️⃣ Configure Environment Variables**
Go into the backend folder 
There is a sample env file present, make any modifications if needed.
```sh
DIRECTORY_PATH='../data'  # Folder containing files to be processed
OLLAMA_MODEL='deepseek-coder:6.7b' # Change this to your preferred model
OLLAMA_API='http://localhost:11434/api/generate' # Ollama API endpoint
FILE_FORMATS='{js,ts,jsx,tsx,pdf,csv,txt}' 
INTERFACE_MODE="" # api/terminal
```

### **4️⃣ Giving Context for LLM**
Copy the e files you want to add as a context into the data folder .
You can also mention the path in the DIRECTORY_PATH variable in .env file

### **5️⃣ Start the Application**
To start the application got to the root folder and run the command.
Make startProject.sh executable by running the command 
```
chmod +x ./startProject.sh
```
Execute the project by running the command
```sh
./startProject.sh
```
You can see the logs in the terminal or in the files created ,called backend.log & frontend.log. If you face any errors you can use these to debug or please raise as an issue.
PS: if you face an error like readable stream is not defined. kindly run the command 
```nvm use 20.10.0``` and then run ./startProject.sh again



## **Usage** 🛠️  

Once the application is running:  

1. **Your codebase will be indexed** using **ChromaDB**.  
2. A **frontend chat interface** will be launched.
3. Go to **http://localhost:8080/** to ask your questions  
4. The model will return an LLM-generated response along with source file references.



## **Things to Do** 🛠️  

1. **Optimize vector classification** – Instead of indexing the entire set of files everytime, try to use a diff checker.  
2. **Experiment with fine-tuning the model** – If the provided files wont change rapidly,explore training/fine tuning the model with that context to recognize patterns and styles more effectively.
3. **Add agents support** – Instead of providing the files locally, you can use agent tool to get the data. Probably using LangChain
5. **Modify the bash script** to include docker setups as well
     

💡 **Have suggestions or want to contribute?** Feel free to reach out!  








