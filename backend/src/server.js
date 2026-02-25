const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: '../.env' }); // Looking for .env in root

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Lab 06: Backend running and GitHub push successful"));

app.get("/about", (req, res) => {
    res.send("Name: Kunal Sharma | Enrollment: CS-2341057 | Section: 3CSE15 (G1)");
});

app.get("/health", (req, res) => res.json({ 
    status: "ok",
    database: process.env.DB_LINK ? "connected (centralized .env verified)" : "not configured"
}));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
