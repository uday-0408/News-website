import express from "express";
import connectDB from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes/user.route.js";
import articleRoutes from "./routes/article.route.js";
import fetchRouter from "./routes/fetch.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

const port = 4000;
const app = express();

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to the server",
    timeStemp: new Date().toISOString(),
    success: true,
  });
});

// API Routes
app.use("/api/user", routes);
app.use("/api/article", articleRoutes);
app.use("/api/news", fetchRouter);
app.use("/api/comments", commentRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
// API_KEY=pub_cc0f4bd99293447cbf76f7846db10774
// MONGO_URL=mongodb://127.0.0.1:27017/NewsApp
// SECRET_KEY='This is some key'
