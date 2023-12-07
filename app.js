const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const db = require("./src/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use the authentication routes
app.use("/api/auth", authRoutes);

// Handle requests for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
