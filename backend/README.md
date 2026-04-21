# RadiologyAI Backend 🐍

This is the FastAPI backend for the RadiologyAI Assistant project. It handles X-ray image processing, database management, and LLM integrations for medical explanations.

## ⚙️ Setup & Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables in `.env`:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```

## 🚀 Running the Server

Start the FastAPI application with Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## 📂 Directory Structure

- `controllers/`: API business logic.
- `models/`: SQLAlchemy database models and AI models.
- `routes/`: FastAPI route definitions.
- `services/`: External integrations (e.g., Groq, Storage).
- `uploads/`: Directory for uploaded X-ray images.
