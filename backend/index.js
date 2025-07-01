import express from "express";
import connectDB from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/user.route.js";
import articleRoutes from "./routes/article.route.js"

dotenv.config();

const port = 4000;
const app = express();

app.use(cookieParser());
app.use(express.json()); // Don't forget this!

app.use(
  cors({
    origin: "http://localhost:3000",
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

// ✅ Corrected path
app.use("/api/user", routes);
app.use("/api/article",articleRoutes)

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
