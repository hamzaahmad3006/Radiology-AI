# RadiologyAI Assistant 🏥

> **AI-powered X-ray analysis and interactive medical explanation assistant**

RadiologyAI Assistant is an AI-powered medical imaging platform that allows users to upload X-ray images and receive automated analysis, disease predictions, and AI-generated explanations of the findings.

The system uses computer vision models to detect abnormalities and combines this with a conversational AI assistant that allows users to ask questions about the analysis results in simple, understandable language.

---

## 🚀 Key Features

- **AI Disease Detection**: Automated analysis of chest X-rays to detect conditions like Pneumonia, Tuberculosis, etc.
- **Confidence Scoring**: Probability-based results for model transparency.
- **Abnormality Heatmaps**: Visual highlighting (heatmaps) of suspected abnormal regions in the scan.
- **AI Explanation Engine**: Converts complex radiology findings into simple, human-readable explanations.
- **Interactive AI Q&A**: A conversational interface to ask follow-up questions about the reports and medical findings.
- **Scan History Tracking**: Securely store and review previous analyses and history.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management & API**: React Hooks, Axios

### Backend
- **API Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI/ML**: [PyTorch](https://pytorch.org/), OpenCV, NumPy
- **LLM Integration**: [Groq Cloud API](https://groq.com/) (for medical explanations and Q&A)
- **Database**: SQLite (SQLAlchemy)

---

## 📂 Project Structure

```text
radiology-ai/
├── backend/                # Python FastAPI server
│   ├── controllers/        # Business logic
│   ├── models/             # Database & ML models
│   ├── routes/             # API endpoints
│   ├── services/           # External service integrations (Groq)
│   ├── uploads/            # Temporary storage for X-ray images
│   ├── main.py             # Entry point
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js web application
│   ├── src/
│   │   ├── components/     # UI & Feature components
│   │   └── pages/          # Application routes
│   └── package.json        # Node.js dependencies
├── .gitignore              # Project-wide ignore rules
└── PRD.md                  # Product Requirements Document
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn
- Groq API Key (for LLM features)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `.env`:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🩺 Medical Disclaimer

**IMPORTANT: FOR EDUCATIONAL PURPOSES ONLY.**

RadiologyAI Assistant is designed for educational and assistive purposes only. It does NOT replace professional medical diagnosis, advice, or treatment. Users should always consult a qualified healthcare professional regarding any medical condition or imaging result.

---

## 👤 Project Owner

- **Hamza Ahmad**

---

## License

This project is for private use only as part of the RadiologyAI MVP development.
