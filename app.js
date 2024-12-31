require("dotenv").config();
const express = require("express");
const helmet = require("helmet");

// Set up the server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine

// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Start Server
app.listen(PORT, () => console.log(`listening on port ${PORT}`));