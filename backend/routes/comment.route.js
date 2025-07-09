import express from "express";
import {
  addComment,
  getComments,
  upvoteComment,
  deleteComment,
  downvoteComment
} from "../controllers/comment.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Add a comment to an article
router.post("/:articleId", isAuthenticated, addComment);

// Get comments for an article
router.get("/:articleId", getComments);

// Upvote a specific comment
router.patch("/:articleId/:commentId/upvote", isAuthenticated, upvoteComment);

// Delete a specific comment
router.delete("/:articleId/:commentId", isAuthenticated, deleteComment);
router.patch("/:articleId/:commentId/downvote", isAuthenticated, downvoteComment);


export default router;
