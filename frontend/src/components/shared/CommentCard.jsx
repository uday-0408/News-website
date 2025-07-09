// src/components/CommentCard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

export default function CommentCard({ articleId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/comments/${articleId}`,
        { withCredentials: true }
      );
      setComments(res.data.comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `http://localhost:4000/api/comments/${articleId}`,
        {
          commentText: newComment,
        },
        { withCredentials: true }
      );

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleUpvote = async (commentId) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/comments/${articleId}/${commentId}/upvote`,
        {},
        { withCredentials: true }
      );
      fetchComments();
    } catch (error) {
      console.error("Failed to upvote comment:", error);
    }
  };

  return (
    <div className="mt-4">
      <h5>Comments</h5>
      <div className="mb-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="form-control"
          rows="3"
          placeholder="Add a comment..."
        />
        <button
          className="btn btn-sm btn-primary mt-2"
          onClick={handleCommentSubmit}
          disabled={!newComment.trim()}
        >
          Post Comment
        </button>
      </div>

      <div className="comment-list">
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((c) => (
          <div
            key={c._id}
            className="border rounded p-2 mb-2 bg-secondary text-light"
          >
            <strong>{c.user?.username || "Anonymous"}</strong>
            <p className="mb-1">{c.comment}</p>
            <div className="d-flex align-items-center gap-2 mb-1">
              <FaThumbsUp
                onClick={() => handleUpvote(c._id)}
                style={{ cursor: "pointer" }}
              />
              <span>{c.upvotes}</span>
            </div>
            <small className="text-muted">
              {new Date(c.createdAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
