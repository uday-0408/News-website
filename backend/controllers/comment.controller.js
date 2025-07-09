import { article as Article } from "../models/article.model.js";
import { user as User } from "../models/User.model.js";
import { comment as Comment } from "../models/comment.model.js";

// Add a new comment to an article
export const addComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { commentText } = req.body;
    const userId = req.id;

    console.log("▶️ Add Comment - Article ID:", articleId);
    console.log("▶️ Add Comment - User ID:", userId);
    console.log("▶️ Add Comment - Comment Text:", commentText);

    if (!commentText) {
      return res.status(400).json({ error: "Comment text is required." });
    }

    let commentDoc = await Comment.findOne({ article: articleId });
    console.log("📘 Existing Comment Doc:", commentDoc ? "Found" : "Not Found");

    const newComment = {
      user: userId,
      comment: commentText,
      upvotes: 0,
      createdAt: new Date(),
    };

    if (!commentDoc) {
      console.log("🆕 Creating new comment thread for article...");
      commentDoc = await Comment.create({
        article: articleId,
        comments: [newComment],
      });
    } else {
      console.log("➕ Adding comment to existing thread...");
      commentDoc.comments.push(newComment);
      await commentDoc.save();
    }

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (err) {
    console.error("❌ Add Comment Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all comments (sorted by upvotes or date)
export const getComments = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { sort = "top" } = req.query;

    console.log("🗂 Get Comments - Article ID:", articleId);
    console.log("🔃 Sort method:", sort);

    const commentDoc = await Comment.findOne({ article: articleId }).populate(
      "comments.user",
      "username profile.profilePicture"
    );

    if (!commentDoc) {
      console.log("🚫 No comments found for this article.");
      return res.status(200).json({ comments: [] });
    }

    let sortedComments = [...commentDoc.comments];

    if (sort === "recent") {
      console.log("⏰ Sorting comments by recency...");
      sortedComments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else {
      console.log("🔥 Sorting comments by upvotes...");
      sortedComments.sort((a, b) => b.upvotes - a.upvotes);
    }

    res.json({ comments: sortedComments });
  } catch (err) {
    console.error("❌ Get Comments Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Upvote a comment
export const upvoteComment = async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const userId = req.id;

    const commentDoc = await Comment.findOne({ article: articleId });
    if (!commentDoc) return res.status(404).json({ error: "Thread not found" });

    const comment = commentDoc.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const userIndex = comment.upvotedBy.findIndex(id => id.toString() === userId);

    if (userIndex === -1) {
      // User has not upvoted yet → add upvote
      comment.upvotes += 1;
      comment.upvotedBy.push(userId);
    } else {
      // User already upvoted → toggle off
      comment.upvotes -= 1;
      comment.upvotedBy.splice(userIndex, 1);
    }

    await commentDoc.save();

    res.json({ message: "Vote updated", upvotes: comment.upvotes, upvotedBy: comment.upvotedBy });
  } catch (err) {
    console.error("Upvote Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a comment (by owner)
export const deleteComment = async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const userId = req.id;

    console.log("🗑 Delete - Article ID:", articleId);
    console.log("🗑 Delete - Comment ID:", commentId);
    console.log("🗑 Delete - Requesting User ID:", userId);

    const commentDoc = await Comment.findOne({ article: articleId });
    if (!commentDoc) {
      console.log("🚫 Comment thread not found.");
      return res.status(404).json({ error: "Comment thread not found" });
    }

    const comment = commentDoc.comments.id(commentId);
    if (!comment) {
      console.log("🚫 Comment not found.");
      return res.status(404).json({ error: "Comment not found" });
    }

    if (String(comment.user) !== String(userId)) {
      console.log("⛔ Unauthorized delete attempt by user:", userId);
      return res
        .status(403)
        .json({ error: "You can only delete your own comment." });
    }

    comment.remove();
    await commentDoc.save();

    console.log("✅ Comment deleted.");

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("❌ Delete Comment Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const downvoteComment = async (req, res) => {
  const { articleId, commentId } = req.params;
  const commentDoc = await Comment.findOne({ article: articleId });
  const comment = commentDoc?.comments?.id(commentId);
  if (!comment) return res.status(404).json({ error: "Comment not found" });

  comment.upvotes = Math.max(0, comment.upvotes - 1);
  await commentDoc.save();

  res.json({ message: "Downvoted", upvotes: comment.upvotes });
};
