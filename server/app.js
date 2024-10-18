const express = require("express");
const cors = require("cors");
const pgp = require("pg-promise")();
const logger = require("morgan");
const validator = require("validator");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

// Middleware to detect possible SQL injection attempts
function detectSQLInjection(req, res, next) {
  const sqlInjectionPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL comments and single quotes
    /\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b/i, // Common SQL keywords
    /\b(OR|AND)\b.*?(=|LIKE|\d)/i, // Common tautologies
    /\b(1=1)\b/, // Common tautology pattern
  ];

  const queryParams = Object.values(req.query).join(" ");
  const bodyParams = JSON.stringify(req.body);

  // Check if query parameters or body contain SQL injection patterns
  if (sqlInjectionPatterns.some((pattern) => pattern.test(queryParams) || pattern.test(bodyParams))) {
    const userIP = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log(`Potential SQL injection attempt detected from IP: ${userIP}`);
    return res.status(400).json({ error: "Invalid input detected" });
  }

  next();
}

const cn = {
  host: "localhost",
  port: 5432,
  database: "rc_test",
  user: "postgres",
};

const db = pgp(cn);

app.use(detectSQLInjection); // Apply the middleware globally

app.get("/users", async (req, res) => {
  try {
    const query = "SELECT * FROM users";
    const result = await db.any(query);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const query = "SELECT * FROM movies";
    const result = await db.any(query);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

app.get("/search", async (req, res) => {
  let { title } = req.query;

  // Sanitize the title input using validator
  title = validator.escape(title);

  // Validate title: allow letters, numbers, spaces, and common punctuation marks.
  if (!title || !/^[a-zA-Z0-9\s.,'!?-]+$/.test(title)) {
    return res.status(400).send("Invalid title");
  }

  const TITLE_LENGTH_LIMIT = 100;

  if (title.length > TITLE_LENGTH_LIMIT) {
    return res.status(400).json({ error: "Search query too long" });
  }

  const sanitizeTitle = title.replace(/[%_]/g, '\\$&');

  try {
    const query = `
      SELECT *
      FROM movies
      WHERE title ILIKE $1`;

    const result = await db.any(query, [`%${sanitizeTitle}%`]);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
