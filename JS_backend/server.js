// Import dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { extractInfo } = require("./extractor"); // ← import from extractor.js
const { produceSolution } = require("./producer"); // ← import from producer.js

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("🚀 Node.js Backend is running!");
});

// Example GET route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node backend!" });
});

// Example POST route
app.post("/api/data", (req, res) => {
  const data = req.body;
  res.json({ message: "Data received successfully!", received: data });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});

