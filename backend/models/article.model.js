import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    content: String,

    // Standardized fields for frontend compatibility
    link: { type: String, unique: true },       // Replaces `url`
    image_url: String,                          // Replaces `imageUrl`
    publishedAt: Date,
    author: String,

    source_name: String,
    source_url: String,
    source_icon: String,

    category: String,
    country: String,

    // Interaction tracking
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    viewedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const article = mongoose.models.Article || mongoose.model('Article', articleSchema);
