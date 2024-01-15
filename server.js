require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const helmet = require("helmet");
// const authRoutes = require("./routes/authRoutes");
// const memberRoutes = require("./routes/memberRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const webhookRoutes = require("./routes/webhookRoutes");

// Set Up Server
const app = express();
const PORT = process.env.PORT || 3000;
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

// Database Connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI);

// Middleware
app.use(helmet());
app.use(express.static("public"));
// app.use("/webooks", webhooks); // this line must be above express.json() usage as is uses raw data instead of json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, //set to true in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, //cookie expires after 24 hours
    },
    store: store,
  })
);

// View Engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.send("new home");
});
// app.use("/auth", authRoutes);
// app.use("/member", memberRoutes);
// app.use("/admin", adminRoutes);
// app.use("/payment", paymentRoutes);

// Start Server
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
