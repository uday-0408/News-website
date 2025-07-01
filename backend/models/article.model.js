// models/Article.js
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    content: String,
    url: { type: String, unique: true }, // ⬅️ Make article ID unique (important)
    imageUrl: String,
    author: String,
    source: String,
    category: String,
    country: String,
    publishedAt: Date,

    // Track user interactions
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    viewedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
const article =
  mongoose.models.Article || mongoose.model("Article", articleSchema);

module.exports = { article };
