import express from "express";
import {
  markArticleAsViewed,
  likeArticle,
  bookmarkArticle,
} from "../controllers/article.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/view", isAuthenticated, markArticleAsViewed);
router.patch("/like", isAuthenticated, likeArticle);
router.patch("/bookmark", isAuthenticated, bookmarkArticle);

export default router;
