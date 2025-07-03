import express from "express";
import {
  markArticleAsViewed,
  likeArticle,
  bookmarkArticle,
  getBookmarks,
  getHistory,
  getLikes,
} from "../controllers/article.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/view", isAuthenticated, markArticleAsViewed);
router.patch("/like", isAuthenticated, likeArticle);
router.patch("/bookmark", isAuthenticated, bookmarkArticle);
router.get("/likes", isAuthenticated, getLikes);
router.get("/bookmarks", isAuthenticated, getBookmarks);
router.get("/history", isAuthenticated, getHistory);

export default router;
