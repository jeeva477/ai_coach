# AI Interview Coach

A fully local, open-source AI Interview Coach using **Ollama** + **FastAPI** + **React**.

No data leaves your computer. Completely private.

---

## Features

- Real-time AI interviewer
- Custom job role, level, and experience
- Intelligent follow-up questions
- Constructive feedback after each answer
- Fully local (runs on your laptop)
- Modern, clean UI

---

## Tech Stack

- **Backend**: FastAPI + Ollama (Local LLM)
- **Frontend**: React + Vite + Tailwind CSS
- **Model**: Llama 3.2 / Mistral / Phi-3 (any Ollama model)

---

## How to Run (Step by Step)

### Prerequisites

1. Install **Ollama** → [https://ollama.com](https://ollama.com)
2. Download a model:

```bash
ollama run llama3.2
# Or try: ollama run mistral, ollama run phi3:mini
