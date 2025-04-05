const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config({ path: "./config/.env" });
require("./config/db");

const userRoutes = require("./routes/authRoute");

const app = express();
const server = http.createServer(app);

// ✅ Trust proxy to support Heroku & rate limiting properly
app.set("trust proxy", 1);

// ✅ Only one declaration for rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});
app.use(limiter); // ✅ Apply to all requests

// ✅ CORS configuration
const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

// ✅ Middlewares
app.use(morgan("dev")); // HTTP request logger
app.use(helmet()); // Security headers
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ Routes
app.use("/api", userRoutes);

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
