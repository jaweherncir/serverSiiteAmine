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

// CORS options
const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(morgan("dev")); // Logging middleware
app.use(helmet()); // Security middleware
app.use(bodyParser.json({ limit: '10mb' })); // Body size limit
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use("/api", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});