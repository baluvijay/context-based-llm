# **Context Based LocalLLM** 🚀  
A **local-first** implementation of LLM-based code analysis using **ChromaDB** and **Ollama**. This project allows you to index your codebase and query it efficiently using a locally running LLM model.  

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
