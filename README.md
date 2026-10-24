# DailyPulse News App

A simple full-stack news app with:
- React + Vite frontend
- Node.js + Express backend
- NewsAPI.org integration
- Search news
- Category filters
- CORS-enabled API proxy
- Environment variable for API key

## 1. Setup backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and add your NewsAPI key:

```env
NEWS_API_KEY=YOUR_NEWSAPI_KEY
PORT=5000
```

Start backend:

```bash
npm run dev
```

Backend runs on http://localhost:5000

## 2. Setup frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite URL shown in terminal, usually http://localhost:5173

## API endpoints

- GET `/api/health`
- GET `/api/news?category=general&country=in`
- GET `/api/search?q=technology`

The NewsAPI key stays on the backend and is not exposed to the browser.
