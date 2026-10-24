
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "DailyPulse News API" });
});

app.get("/api/news", async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({
        error: "NEWS_API_KEY is missing. Add it to backend/.env"
      });
    }

    const category = String(req.query.category || "general");
    const country = String(req.query.country || "in");
    const pageSize = Math.min(
      Math.max(Number(req.query.pageSize) || 20, 1),
      100
    );

    const headlinesUrl = new URL(
      "https://newsapi.org/v2/top-headlines"
    );

    headlinesUrl.searchParams.set("country", country);
    headlinesUrl.searchParams.set("pageSize", String(pageSize));
    headlinesUrl.searchParams.set("category", category);

    let response = await fetch(headlinesUrl, {
      headers: { "X-Api-Key": NEWS_API_KEY }
    });

    let data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Fallback when no top headlines are available
    if (!Array.isArray(data.articles) || data.articles.length === 0) {
      const searchUrl = new URL(
        "https://newsapi.org/v2/everything"
      );

      
const categoryQueries = {
  general: "India OR news",
  business: "business OR markets OR economy",
  technology: "technology OR artificial intelligence",
  sports: "sports OR cricket OR football",
  health: "health OR medical OR medicine",
  entertainment: "movies OR entertainment OR celebrity",
  science: "science OR research OR space"
};

searchUrl.searchParams.set(
  "q",
  categoryQueries[category] || "India OR news"
);

      searchUrl.searchParams.set("language", "en");
      searchUrl.searchParams.set("sortBy", "publishedAt");
      searchUrl.searchParams.set("pageSize", String(pageSize));

      response = await fetch(searchUrl, {
        headers: { "X-Api-Key": NEWS_API_KEY }
      });

      data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }
    }

    return res.json(data);
  } catch (error) {
    console.error("News fetch error:", error);
    return res.status(500).json({
      error: "Failed to fetch news"
    });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({
        error: "NEWS_API_KEY is missing. Add it to backend/.env"
      });
    }

    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        error: "Search query is required"
      });
    }

    const pageSize = Math.min(
      Math.max(Number(req.query.pageSize) || 20, 1),
      100
    );

    const url = new URL(
      "https://newsapi.org/v2/everything"
    );

    url.searchParams.set("q", q);
    url.searchParams.set("language", "en");
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("pageSize", String(pageSize));

    const response = await fetch(url, {
      headers: { "X-Api-Key": NEWS_API_KEY }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.json(data);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      error: "Failed to search news"
    });
  }
});

app.listen(PORT, () => {
  console.log(`DailyPulse API running at http://localhost:${PORT}`);
});
