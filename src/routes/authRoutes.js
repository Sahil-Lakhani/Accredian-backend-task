const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.status(201).json({ message: "User created successfully" });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // Retrieve user from the database by username or email
  db.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [usernameOrEmail, usernameOrEmail],
    async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Check if the user exists
      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const user = results[0];

      // Compare the entered password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // Passwords match, user is authenticated
      return res
        .status(200)
        .json({ message: "You are logged in!", username: user.username });
    }
  );
});

module.exports = router;
