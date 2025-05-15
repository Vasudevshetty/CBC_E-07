# StudySyncs - AI-Powered Learning Platform (24-Hour Hackathon Project)

This project was developed as part of a 24-hour hackathon. StudySyncs is an AI-powered learning platform designed to assist students with their studies. It features a personalized AI assistant, revision tools, career path guidance, and more.

## Project Structure

The project is divided into three main parts:

1.  **Client (React + Vite):** The frontend application built with React and Vite, providing the user interface.
2.  **Server (Node.js + Express):** The backend API server built with Node.js and Express, handling user authentication, data storage, and business logic.
3.  **Services (Python + FastAPI):** A separate Python-based microservice using FastAPI to handle AI-powered features, including interaction with Large Language Models (LLMs) via Langchain and Groq.

## Technologies Used

### Client (Frontend)

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool and development server for modern web projects.
*   **Redux Toolkit:** For state management.
*   **React Router:** For handling client-side routing.
*   **Tailwind CSS:** A utility-first CSS framework for styling.
*   **Axios:** For making HTTP requests to the backend.
*   **Other notable libraries:** `react-icons`, `react-markdown`, `katex` (for math rendering), `react-hot-toast` (for notifications).

### Server (Backend - Node.js)

*   **Node.js:** A JavaScript runtime environment.
*   **Express.js:** A web application framework for Node.js.
*   **MongoDB (with Mongoose):** A NoSQL database for storing user data and application content.
*   **JSON Web Tokens (JWT):** For user authentication and authorization.
*   **bcrypt:** For password hashing.
*   **Cookie-parser:** For parsing cookies.
*   **Cors:** For enabling Cross-Origin Resource Sharing.
*   **Dotenv:** For managing environment variables.
*   **Helmet:** For securing HTTP headers.
*   **Morgan:** For HTTP request logging.
*   **Multer:** For handling file uploads (e.g., profile images).
*   **Nodemailer:** For sending emails (e.g., password reset).

### Services (AI/ML - Python)

*   **Python:** The primary language for AI/ML services.
*   **FastAPI:** A modern, fast (high-performance) web framework for building APIs with Python.
*   **Langchain:** A framework for developing applications powered by language models.
*   **Langchain Groq:** Integration with Groq for fast LLM inference.
*   **FAISS:** For efficient similarity search and dense vector retrieval.
*   **Hugging Face Transformers:** For accessing pre-trained models.
*   **youtube-transcript-api:** For fetching transcripts from YouTube videos.
*   **Pydantic:** For data validation.
*   **Uvicorn:** An ASGI server for FastAPI.
*   **Other notable libraries:** `pypdf` (for PDF processing), `scikit-learn`, `numpy`.

## Key Features (Conceptual)

*   **Personalized AI Assistant:** Chatbot for answering student queries.
*   **Document Upload & RAG:** Users can upload textbooks (PDFs) which are then used in a Retrieval Augmented Generation (RAG) system to provide context-aware answers.
*   **Session Management & Chat History:** Tracks user interactions with the AI.
*   **Recommendations:** Provides learning recommendations based on subject and learner type.
*   **Autocomplete Suggestions:** Helps users formulate queries.
*   **Revision Assistant:** Tools to help students revise topics.
*   **Career Path Guidance:** Information and suggestions for career paths.
*   **Video Q&A:** Ability to ask questions about YouTube video content (leveraging transcripts).
*   **Aptitude & Assessments:** Features for testing user knowledge.
*   **User Authentication & Profile Management:** Secure login, registration, and profile updates.
*   **Streak & Activity Tracking:** Motivates users by tracking their learning activity.

## Setup and Running the Project

*(Instructions would typically go here, but given the hackathon context, this might be brief or focused on how it was run during the event.)*

**Client:**
```bash
cd client
npm install
npm run dev
```

**Server (Node.js):**
```bash
cd server
npm install
npm run dev # or npm start
```

**Services (Python):**
```bash
cd services
# It's recommended to use a virtual environment
python -m venv gatenv
source gatenv/Scripts/activate # On Windows: gatenv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn api:api --reload
```
Ensure you have a `.env` file set up in the `server` and `services` directories with the necessary environment variables (e.g., `MONGO_URI`, `GROQ_API_KEY3`, `GROQ_API_KEY4`, `HF_TOKEN`, `CLIENT_URL`, `PORT`).

## Hackathon Context

This project was built under the time constraints of a 24-hour hackathon. The focus was on demonstrating the core concepts and integrating various AI-powered features into a learning platform. Further development would be needed for a production-ready application, including more robust error handling, comprehensive testing, and UI/UX refinements.

---

This README provides a good overview of your hackathon project! Let me know if you'd like any sections expanded or modified.
