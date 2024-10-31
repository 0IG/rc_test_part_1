const express = require("express");
const cors = require("cors");
const pgp = require("pg-promise")();
const logger = require("morgan");
const validator = require("validator");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const email = req.headers.email;
  const password = req.headers.password;

  if (!authHeader || !email || !password) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const query = "SELECT * FROM users WHERE email = $1 AND password = $2";
    const user = await db.oneOrNone(query, [email, password]);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
  
  next();
} catch (err) {
  console.error(err.message);
  res.status(500).json({ error: "An error occurred while processing your request." });
}
}
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
  // Since this is localhost environment we get a loopback address in IPv6
  if (sqlInjectionPatterns.some((pattern) => pattern.test(queryParams) || pattern.test(bodyParams))) {
    const userIP = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log(`Potential SQL injection attempt detected from IP: ${userIP}`);
    return res.status(400).json({ error: "Invalid input detected" });
  }

  next();
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

const cn = {
  host: "localhost",
  port: 5432,
  database: "rc_test",
  user: "postgres",
};

const db = pgp(cn);

app.use(detectSQLInjection); // Apply the middleware globally

app.get("/users", authenticateUser,authorizeRole("admin"), async (req, res) => {
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

app.post("/register", async (req, res) => {
  const { email,name,password } = req.body;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "Password does not meet complexity requirements" });
  }
  if (!email || !name || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await db.oneOrNone(
      "SELECT * FROM users WHERE name = $1 OR email = $2", 
      [name, email]
    );

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(400).json({ message: "Username already exists" });
    }
    const newUser = await db.one(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    )
    res.status(201).json({
      message: "User created successfully",
      user: newUser});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = $1 AND password = $2";
    const user = await db.oneOrNone(query, [email, password]);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    } else {
      return res.status(200).json({ message: "Login successful", user: user.name, role: user.role});
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
