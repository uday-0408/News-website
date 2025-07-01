// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    phone: String,
    profile: {
      bio: { type: String, default: "" },
      profilePicture: { type: String, default: "" }, // Path or URL
      gender:{type:String,default:""},
      dob:{type:Date},
    },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    likedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    history: [
      {
        article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
const user = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = { user };