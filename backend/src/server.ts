import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Postgres connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "db",
  database: process.env.DB_NAME || "cardsdb",
  password: process.env.DB_PASSWORD || "postgres",
  port: Number(process.env.DB_PORT) || 5432,
});


// Routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/cards", async (req, res) => {
  const result = await pool.query("SELECT * FROM cards ORDER BY id ASC");
  res.json(result.rows);
});

app.post("/cards/:id/click", async (req, res) => {
  const { id } = req.params;
  await pool.query(
    `UPDATE cards
     SET click_count = click_count + 1,
         first_click = COALESCE(first_click, NOW())
     WHERE id = $1`,
    [id]
  );
  const updated = await pool.query("SELECT * FROM cards WHERE id = $1", [id]);
  res.json(updated.rows[0]);
});

app.post("/cards/reset", async (req, res) => {
  await pool.query("UPDATE cards SET click_count = 0, first_click = NULL");
  const reset = await pool.query("SELECT * FROM cards ORDER BY id ASC");
  res.json(reset.rows);
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
